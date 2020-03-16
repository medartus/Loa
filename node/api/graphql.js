const { GraphQLClient } = require('graphql-request')

const { YELP_GRAPQHL_ENDPOINT, YELP_API_KEY } = require('../config');
 
const client = new GraphQLClient(YELP_GRAPQHL_ENDPOINT,{
    headers: {
      Authorization: 'Bearer '+YELP_API_KEY,
    },
  })

const graphqlQuery = (query) =>{
    return client.request(query)
}

module.exports = { graphqlQuery };
