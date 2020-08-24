import http from "./httpService";

export class LecturersService {
  constructor() {
    this.apiEndpoint = "http://localhost:3333/lecturers";
  }

  getLecturers() {
    return http.get(this.apiEndpoint);
  }

  getLecturer(id) {
    return http.get(`${this.apiEndpoint}/${id}`);
  }

  saveLecturer(lecturer) {
    if (lecturer.id) {
      return this.putLecturer(lecturer.id, lecturer);
    } else {
      return this.postLecturer(lecturer);
    }
  }

  postLecturer(lecturer) {
    return http.post(`${this.apiEndpoint}`, lecturer);
  }

  putLecturer(id, lecturer) {
    return http.put(`${this.apiEndpoint}/${id}`, lecturer);
  }

  deleteLecturer(id) {
    return http.delete(`${this.apiEndpoint}/${id}`);
  }
}
