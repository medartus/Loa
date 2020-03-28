const { graphqlQuery } = require("../api/graphql");
const axios = require("axios");
const {
  businessQuery,
  searchQuery,
  bestQuery,
  howManyQuery
} = require("./query");

const textualResponse = require("../response/text.json");
const gifResponse = require("../response/gif.json");

const generatgif = (intent) => {
  const answer = gifResponse[intent.toLowerCase()];
  const index = Math.floor(Math.random() * answer.length);
  const gif = answer[index];
};


const generateResponse = (intent, type, location, message, results) => {
  if (message != null) {
    const gif = generatgif(intent)
    message = [
      {
        "type" : "text",
        "content" : message
      },
      {
        "type" : "gif",
        "content" : gif
      },
    ]
  }
  let response = {
    intent,
    type,
    location,
    message,
    results
  };
  return response;
};

const requestBusinessByIds = ids =>
  new Promise((resolve, reject) => {
    const query = businessQuery(ids);
    graphqlQuery(query)
      .then(data => {
        resolve(data);
      })
      .catch(e => reject(e));
});

const quickResponse = intent => {
  const answer = textualResponse[intent.toLowerCase()];
  const index = Math.floor(Math.random() * answer.length);
  const message = answer[index];

  const response = generateResponse(intent, null, null, message, null);

  return response;
};

const recommend = (intent, desire, location) =>
  new Promise((resolve, reject) => {
    if (!desire) desire = "restaurant";
    axios
      .post("https://loa-recommend.herokuapp.com/v1/recommend", {
        message: desire
      })
      .then(response => {
        const ids = response.data.data.results;
        requestBusinessByIds(ids)
          .then(rep => {
            results = [];
            for (let i = 0; i < ids.length; i++) {
              const business = rep[`b${i}`];
              console.log(business["categories"]);
              results.push(business);
            }

            message = `Oh, ${desire} is a good idea! Let me recommend you these restaurants.`;
            rep = generateResponse(intent, desire, location, message, results);
            resolve(rep);
          })
          .catch(err => reject(err));
      })
      .catch(error => console.log(error));
  });

const search = (intent, type, data, location) => {
  const results = data.search.business;
  const message = `You can find a map of ${type} ${location.name}.`;
  const response = generateResponse(intent, type, location, message, results);

  return response;
};

const best = (intent, type, data, location) => {
  const results = data.search.business;
  for (const index in results) {
    const company = results[index];
    company["score"] = company.rating * company.rating * company.review_count;
  }

  results.sort((a, b) => {
    return b.score - a.score;
  });

  const message = `The best ${type} ${location.name} is ${results[0].name}.`;
  const response = generateResponse(intent, type, location, message, results);

  return response;
};

const howMany = (intent, type, data, location) => {
  const total = data.search.total;

  const message = `There are ${total} ${type} ${location.name}.`;
  const response = generateResponse(intent, type, location, message, []);

  return response;
};

const yelpGraphQL = (intent, type, location) =>
  new Promise((resolve, reject) => {
    const { longitude, latitude } = location.coordinates;

    let query = undefined;
    switch (intent) {
      case "Search":
        query = searchQuery(type, longitude, latitude);
        break;
      case "Best":
        query = bestQuery(type, longitude, latitude);
        break;
      case "Number":
        query = howManyQuery(type, longitude, latitude);
        break;
      default:
        throw new ErrorHandler(500, "No intent found");
    }

    graphqlQuery(query)
      .then(data => {
        let response;
        switch (intent) {
          case "Search":
            response = search(intent, type, data, location);
            break;
          case "Best":
            response = best(intent, type, data, location);
            break;
          case "Number":
            response = howMany(intent, type, data, location);
            break;
          default:
            throw new ErrorHandler(500, "No intent found");
            break;
        }
        resolve(response);
      })
      .catch(err => {
        reject(err);
      });
  });

module.exports = {
  requestBusinessByIds,
  quickResponse,
  recommend,
  yelpGraphQL
};
