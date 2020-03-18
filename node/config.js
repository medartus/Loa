const dotenv = require('dotenv');

const result = dotenv.config({ path: './.env'});
if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;

module.exports = process.env.ENVIRONMENT === 'dev' ? envs : process.env;