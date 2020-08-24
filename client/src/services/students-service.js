import { HttpService } from "./http-service";

export class StudentsService extends HttpService {
  constructor() {
    const apiEndpoint = "http://localhost:3333/students";
    super(apiEndpoint);
  }
}
