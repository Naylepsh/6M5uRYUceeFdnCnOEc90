require('dotenv').config();

const dev = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DEV_DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DEV_DATABASE_NAME,
    username: process.env.DEV_DATABASE_USERNAME,
    password: process.env.DEV_DATABASE_PASSWORD,
  },
});

const test = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.TEST_DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
  },
});
const config = { dev, test };

export default config[process.env.NODE_ENV || 'dev']();
