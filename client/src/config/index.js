import { config } from "dotenv";
config();

console.log(process.env.REACT_APP_CONSULTATIONS_SERVICE_URL);
export default {
  apiUrl: process.env.REACT_APP_CONSULTATIONS_SERVICE_URL,
};
