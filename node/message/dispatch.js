const { graphqlQuery } = require('../api/graphql');
const { geocode } = require('../api/maps');
const { searchQuery, bestQuery, howManyQuery } = require('./query');
const textualResponse = require('../response/response.json')

const generateResponse = (intent,type,location,lat,lng,message,results) =>{
    let response = {
        intent,
        type,
        "location":null,
        message,
        results
    }
    if(location !== null){
        response['location'] = { "name": location, "coordinates" : { "latitude": lat, "longitude": lng }}
    }
    return response
}

const search = (intent,type,location) => new Promise((resolve,reject)=>{

    geocode(location).then(({lat,lng})=>{

        const query  = searchQuery(type,lng,lat);

        graphqlQuery(query).then(data => {

            const results = data.search.business
            const message = `You can find a map of ${type} in ${location}.`
            const response = generateResponse(intent,type,location,lat,lng,message,results)

            resolve(response);

        }).catch((err)=>{
            reject(err)
        })
    }).catch((err)=>{
        reject(err)
    })
})


const best = (intent,type,location) => new Promise((resolve,reject)=>{

    geocode(location).then(({lat,lng})=>{

        const query  = bestQuery (type,lng,lat);

        graphqlQuery(query).then(data => {

            const results = data.search.business
            for (const index in results) {
                const company = results[index];
                company["score"] = company.rating * company.rating * company.review_count;
            }

            results.sort((a, b) =>{ return b.score - a.score });

            const message = `The best ${type} in ${location} is ${results[0].name}.`
            const response = generateResponse(intent,type,location,lat,lng,message,results)

            resolve(response);

        }).catch((err)=>{
            reject(err)
        })
    }).catch((err)=>{
        reject(err)
    })

})

const howMany = (intent,type,location) => new Promise((resolve,reject)=>{

    geocode(location).then(({lat,lng})=>{

        const query  = howManyQuery(type,lng,lat);

        graphqlQuery(query).then(data => {

            const total = data.search.total
        
            const message = `There are ${total} ${type} in ${location}.`
            const response = generateResponse(intent,type,location,lat,lng,message,[])

            resolve(response);

        }).catch((err)=>{
            reject(err)
        })
    }).catch((err)=>{
        reject(err)
    })

})


const greetings = (intent) => new Promise((resolve,reject)=>{

    const greetingsResponse = textualResponse["greetings"]
    const index = Math.floor(Math.random() * greetingsResponse.length);
    const message = greetingsResponse[index];

    const response = generateResponse(intent,null,null,null,null,message,null);

    resolve(response)

})

module.exports = { search, greetings, best, howMany };