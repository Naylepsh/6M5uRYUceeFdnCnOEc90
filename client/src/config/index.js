const dotenv = require("dotenv");
dotenv.config();

export default {
  consultationServiceURL: process.env.CONSULTATIONS_SERVICE_URL,
};
