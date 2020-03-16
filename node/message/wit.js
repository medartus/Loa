const { Wit } = require('node-wit');
const { WIT_SERVER_ACCESS_TOKEN } = require('../config');

const client = new Wit({accessToken: WIT_SERVER_ACCESS_TOKEN});

const sendMessage = (message) => {
    return client.message(message, {})
}

const extractEntity = (nlp,entity,proba=0.8) => {
    const { entities } = nlp;
    const keys = Object.keys(entities)
    for (let i = 0; i < keys.length; i++){
        const key = keys[i];
        if(key === entity){
            const { confidence, value } = entities[key][0];
            if(confidence >= proba)
                return value;
        }
    }
    return null;
}

module.exports = { sendMessage, extractEntity };