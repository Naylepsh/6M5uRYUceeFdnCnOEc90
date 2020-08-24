import { HttpService } from "./http-service";

export class ParentsService extends HttpService {
  constructor() {
    const apiEndpoint = "http://localhost:3333/parents";
    super(apiEndpoint);
  }
}
