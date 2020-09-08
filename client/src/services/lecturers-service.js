import { HttpService } from "./http-service";
import config from "../config";

export class LecturersService extends HttpService {
  constructor() {
    const apiEndpoint = `${config.apiUrl}/lecturers`;
    super(apiEndpoint);
  }
}
