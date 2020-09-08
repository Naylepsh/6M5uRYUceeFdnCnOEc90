import { HttpService } from "./http-service";
import config from "../config";

export class GroupsService extends HttpService {
  constructor() {
    const apiEndpoint = `${config.apiUrl}/groups`;
    super(apiEndpoint);
  }
}
