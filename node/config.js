const dotenv = require("dotenv");

let envs = process.env;

if(process.env.ENVIRONMENT === 'dev'){
  const result = dotenv.config({ path: './.env'});
  if (result.error) {
    throw result.error;
  }

  envs = result.parsed;
}

module.exports = envs;
