require('dotenv').config();
const env = process.env.NODE_ENV;

console.log(env);

const dev = {
  app: {
    port: process.env.DEV_PORT || 1337,
  },
};

const test = {
  app: {
    port: process.env.TEST_PORT || 1336,
  },
};

const cfg = {
  dev,
  test,
};

export const config = cfg[env];
