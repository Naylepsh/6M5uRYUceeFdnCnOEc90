import axios from "axios";
import logger from "./log-service";

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    logger.log(error);
  }
  return Promise.reject(error);
});

export class HttpService {
  constructor(apiEndpoint) {
    this.apiEndpoint = apiEndpoint;
  }

  getAll(query) {
    const endpoint = query ? `${this.apiEndpoint}?${query}` : this.apiEndpoint;
    return axios.get(endpoint);
  }

  getOneById(id) {
    return axios.get(this.getUrlWithId(id));
  }

  save(object) {
    if (object.id) {
      return axios.put(this.getUrlWithId(object.id), object);
    } else {
      return axios.post(this.apiEndpoint, object);
    }
  }

  delete(id) {
    return axios.delete(this.getUrlWithId(id));
  }

  getUrlWithId(id) {
    return `${this.apiEndpoint}/${id}`;
  }
}
