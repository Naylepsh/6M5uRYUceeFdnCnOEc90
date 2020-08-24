import { HttpService } from "./http-service";

export class GroupsService extends HttpService {
  constructor() {
    const apiEndpoint = "http://localhost:3333/groups";
    super(apiEndpoint);
  }
}
