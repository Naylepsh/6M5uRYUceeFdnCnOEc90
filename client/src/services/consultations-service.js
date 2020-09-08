import { HttpService } from "./http-service";
import config from "../config";

export class ConsultationsService extends HttpService {
  constructor() {
    const apiEndpoint = `${config.apiUrl}/consultations`;
    super(apiEndpoint);
  }

  getConsultationsBetween(startDate, endDate) {
    const query = `between[]=${startDate}&between[]=${endDate}`;
    return this.getAll(query);
  }
}
