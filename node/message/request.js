const { graphqlQuery } = require("../api/graphql");
const axios = require("axios");
const { RECOMMEND_ENDPOINT } = require('../config');
const {
  businessQuery,
  searchQuery,
  bestQuery,
  howManyQuery
} = require("./query");

const textualResponse = require("../response/text.json");
const gifResponse = require("../response/gif.json");

const generateGif = intent => {
  const answer = gifResponse[intent.toLowerCase()];
  const index = Math.floor(Math.random() * answer.length);
  const gif = answer[index];
  return gif;
};

const getGifProbability = intent =>{
  switch(intent){
    case "Greeting":
    case "Goodbye":
    case "Thanks":
      return 1.0
    case "Number":
      return 0.5
    default:
      return 0.3
  }
}

const generateResponse = (intent, type, location, message, results) => {
  if (message !== null) {
    message = [{ type: "text", content: message }];

    const rnd = Math.random();
    const gifProba = getGifProbability(intent);

    if (rnd <= gifProba){
      message.unshift({
        type: "gif",
        content: generateGif(intent)
      });
    }
  }
  return {
    intent,
    type,
    location,
    message,
    results
  };
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

const getMessageWithArgs = (intent, ...args) => {
  const answer = textualResponse[intent.toLowerCase()];
  const index = Math.floor(Math.random() * answer.length);
  let message = answer[index];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === null) return null;
    message = message.replace("#", arg.toString());
  }
  return message;
};

const recommend = (intent, desire, location) =>
  new Promise((resolve, reject) => {
    if (!desire) desire = "restaurant";
    console.log(RECOMMEND_ENDPOINT)
    axios
      .post(RECOMMEND_ENDPOINT, {
        message: desire
      })
      .then(response => {
        const ids = response.data.data.results;
        requestBusinessByIds(ids)
          .then(rep => {
            results = [];
            for (let i = 0; i < ids.length; i++) {
              const business = rep[`b${i}`];
              results.push(business);
            }

            message = getMessageWithArgs(intent, desire);
            rep = generateResponse(intent, desire, location, message, results);
            resolve(rep);
          })
          .catch(err => reject(err));
      })
      .catch(error => console.log(error));
  });

const search = (intent, type, data, location) => {
  const results = data.search.business;
  const message = getMessageWithArgs(intent, type, location.name);
  // if something wasn't found in either of the above args (type, location.name)
  if (message === null) return quickResponse("Misunderstanding");
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

  const message = getMessageWithArgs(
    intent,
    type,
    location.name,
    results[0].name
  );
  if (message === null) return quickResponse("Misunderstanding");
  const response = generateResponse(intent, type, location, message, results);

  return response;
};

const howMany = (intent, type, data, location) => {
  const total = data.search.total;

  const message = getMessageWithArgs(intent, total, type, location.name);
  if (message === null) return quickResponse("Misunderstanding");
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
