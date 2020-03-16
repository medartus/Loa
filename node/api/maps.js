const { GOOGLE_MAPS_API_KEY } = require('../config');

const googleMapsClient = require('@google/maps').createClient({key: GOOGLE_MAPS_API_KEY});

const geocode = (location) => new Promise((resolve, reject) => {
    googleMapsClient.geocode({
        address: location
      }, (err, response) =>{
        if (!err) {
          resolve(response.json.results[0].geometry.location);
        }
        else{
          reject(err)
        }
      });
})

module.exports = { geocode };