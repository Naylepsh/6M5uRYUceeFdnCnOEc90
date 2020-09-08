import { HttpService } from "./http-service";
import config from "../config";

export class ParentsService extends HttpService {
  constructor() {
    const apiEndpoint = `${config.apiUrl}/parents`;
    super(apiEndpoint);
  }
}
