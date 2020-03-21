const express = require('express');
const router = express.Router();
const { sendMessage, extractEntity } = require('./wit');
const { ErrorHandler } = require('../helpers/error');
const request = require('./request');
const { geocode } = require('../api/maps');

router.post('/message', (req, res) => {
    
    res.header("Access-Control-Allow-Origin", "*");

    const { message, user } = req.body;
    
    if(message === undefined) throw new ErrorHandler(404, 'message is required');
    if(user === undefined) throw new ErrorHandler(404, 'user is required');
    if(user.coordinates === undefined) throw new ErrorHandler(404, 'coordinates is required');
    if(user.coordinates.longitude === undefined) throw new ErrorHandler(404, 'longitude is required');
    if(user.coordinates.latitude === undefined) throw new ErrorHandler(404, 'latitude is required');

    sendMessage(message)
        .then(async data => {
            try {
                const intent = extractEntity(data,'intent')
                const type = extractEntity(data,'type')
                const location = extractEntity(data,'location')
                const personalLocation = extractEntity(data,'personalLocation')
    
                if(intent === "Greeting"){
                    const response = request.greetings(intent)
                    res.send(response);
                }
                else{
                    let { latitude, longitude } = user.coordinates;
    
                    if(personalLocation != 'me'){
                        await geocode(location).then(({lat,lng})=>{
                            longitude = lng;
                            latitude = lat;
                        })
                    }
                    
                    const resultLocation = {
                        "name": personalLocation === 'me' ? "near you" :  "near " + location,
                        "coordinates":{
                            latitude,
                            longitude
                        }
                    }
                    
                    request.yelpGraphQL(intent,type,resultLocation)
                    .then(response => res.send(response))
                    .catch(err => {throw new ErrorHandler(500, err)});
                }
            } catch (err) {
                throw new ErrorHandler(500, err);
            }
        }).catch(err => {
            throw new ErrorHandler(500, err);
        })
});

module.exports = router;