import { HttpService } from "./http-service";

export class ConsultationsService extends HttpService {
  constructor() {
    const apiEndpoint = "http://localhost:3333/consultations";
    super(apiEndpoint);
  }

  getConsultationsBetween(startDate, endDate) {
    const query = `between[]=${startDate}&between[]=${endDate}`;
    return this.getAll(query);
  }
}
