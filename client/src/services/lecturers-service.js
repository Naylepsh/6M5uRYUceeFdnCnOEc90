import { HttpService } from "./http-service";

export class LecturersService extends HttpService {
  constructor() {
    const apiEndpoint = "http://localhost:3333/lecturers";
    super(apiEndpoint);
  }
}
