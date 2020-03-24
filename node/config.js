const dotenv = require("dotenv");

let envs = process.env;

const result = dotenv.config({ path: "./.env" });
if (result.error) {
  throw result.error;
}
envs = result.parsed;
envs.PORT = 8080;

module.exports = envs;
