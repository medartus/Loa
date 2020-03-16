const express = require('express');
const router = express.Router();
const { sendMessage, extractEntity } = require('./wit');
const { ErrorHandler } = require('../helpers/error');
const dispatch = require('./dispatch');

router.post('/message', (req, res) => {
    const { message, user } = req.body;
    
    if(message === undefined) throw new ErrorHandler(404, 'message is required');
    if(user === undefined) throw new ErrorHandler(404, 'user is required');
    if(user.coordinates === undefined) throw new ErrorHandler(404, 'coordinates is required');
    if(user.coordinates.longitude === undefined) throw new ErrorHandler(404, 'longitude is required');
    if(user.coordinates.latitude === undefined) throw new ErrorHandler(404, 'latitude is required');

    sendMessage(message)
        .then(data=>{
            const intent = extractEntity(data,'intent')
            const type = extractEntity(data,'type')
            const location = extractEntity(data,'location')

            switch (intent) {
                case "Search":
                    dispatch.search(intent,type,location)
                        .then(response => res.send(response))
                        .catch(e => {throw new ErrorHandler(500, e)})
                    break;
                case "Greeting" :
                    dispatch.greetings(intent)
                        .then(response => res.send(response))
                        .catch(e => {throw new ErrorHandler(500, e)})
                    break;
                case "Best" :
                    dispatch.best(intent,type,location)
                        .then(response => res.send(response))
                        .catch(e => {throw new ErrorHandler(500, e)})
                    break;
                case "Number" :
                    dispatch.howMany(intent,type,location)
                        .then(response => res.send(response))
                        .catch(e => {throw new ErrorHandler(500, e)})
                    break;
                default:
                    throw new ErrorHandler(500, 'No intent found');
                    break;
            }
        }).catch(e => {
            throw new ErrorHandler(500, e);
        })
});

module.exports = router;