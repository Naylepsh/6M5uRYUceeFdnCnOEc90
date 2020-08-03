require('dotenv').config();

const dev = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DEV_DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    name: process.env.DEV_DATABASE_NAME,
    username: process.env.DEV_DATABASE_USERNAME,
    password: process.env.DEV_DATABASE_PASSWORD,
    synchronize: false,
  },
  smptTransport: {
    service: 'ethereal',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
  },
});

const test = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.TEST_DATABASE_HOST || 'localhost',
    port: parseInt(process.env.TEST_DATABASE_PORT, 10) || 5432,
    name: process.env.TEST_DATABASE_NAME,
    username: process.env.TEST_DATABASE_USERNAME,
    password: process.env.TEST_DATABASE_PASSWORD,
    synchronize: true,
  },
  smptTransport: {
    service: 'ethereal',
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
  },
});

const prod = () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.PROD_DATABASE_HOST || 'localhost',
    port: parseInt(process.env.PROD_DATABASE_PORT, 10) || 5432,
    name: process.env.PROD_DATABASE_NAME,
    username: process.env.PROD_DATABASE_USERNAME,
    password: process.env.PROD_DATABASE_PASSWORD,
    synchronize: false,
  },
  smptTransport: {
    service: process.env.MAIL_PROD_SERVICE,
  },
});

const config = { prod, dev, test };

export default config[process.env.NODE_ENV || 'dev']();
