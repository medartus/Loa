const { graphqlQuery } = require('../api/graphql');
const { searchQuery, bestQuery, howManyQuery } = require('./query');
const textualResponse = require('../response/response.json');

const generateResponse = (intent,type,location,message,results) =>{
    let response = {
        intent,
        type,
        location,
        message,
        results
    }
    return response
}

const greetings = (intent) => {

    const greetingsResponse = textualResponse["greetings"]
    const index = Math.floor(Math.random() * greetingsResponse.length);
    const message = greetingsResponse[index];

    const response = generateResponse(intent,null,null,message,null);

    return response;

}


const search = (intent,type,data,location) => {

    const results = data.search.business
    const message = `You can find a map of ${type} ${location.name}.`
    const response = generateResponse(intent,type,location,message,results)

    return response;
}

const best = (intent,type,data,location) => {

    const results = data.search.business
    for (const index in results) {
        const company = results[index];
        company["score"] = company.rating * company.rating * company.review_count;
    }

    results.sort((a, b) =>{ return b.score - a.score });

    const message = `The best ${type} ${location.name} is ${results[0].name}.`
    const response = generateResponse(intent,type,location,message,results)

    return response;

}

const howMany = (intent,type,data,location) => {

    const total = data.search.total

    const message = `There are ${total} ${type} ${location.name}.`
    const response = generateResponse(intent,type,location,message,[])

    return response;
}

const yelpGraphQL = (intent,type,location) => new Promise((resolve,reject)=>{

    const { longitude, latitude } = location.coordinates;

    let query = undefined;
    switch (intent) {
        case "Search":
            query = searchQuery(type,longitude,latitude);
            break;
        case "Best" :
            query = bestQuery(type,longitude,latitude);
            break;
        case "Number" :
            query = bestQuery(type,longitude,latitude);
            break;
        default:
            throw new ErrorHandler(500, 'No intent found');
    }

    graphqlQuery(query).then(data => {
        let response;
        switch (intent) {
            case "Search":
                response = search(intent,type,data,location)
                break;
            case "Best" :
                response = best(intent,type,data,location)
                break;
            case "Number" :
                response = howMany(intent,type,data,location)
                break;
            default:
                throw new ErrorHandler(500, 'No intent found');
                break;
        }
        resolve(response)
    }).catch((err)=>{
        reject(err)
    })

})



module.exports = { greetings, yelpGraphQL };