import { HttpService } from "./http-service";
import config from "../config";

export class StudentsService extends HttpService {
  constructor() {
    const apiEndpoint = `${config.apiUrl}/students`;
    super(apiEndpoint);
  }
}
