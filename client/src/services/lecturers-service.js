import http from "./httpService";

const apiEndpoint = "http://localhost:3333/lecturers";

export function getLecturers() {
  return http.get(apiEndpoint);
}

export function getLecturer(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function saveLecturer(lecturer) {
  if (lecturer.id) {
    return putLecturer(lecturer.id, lecturer);
  } else {
    return postLecturer(lecturer);
  }
}

export function postLecturer(lecturer) {
  return http.post(`${apiEndpoint}`, lecturer);
}

export function putLecturer(id, lecturer) {
  return http.put(`${apiEndpoint}/${id}`, lecturer);
}

export function deleteLecturer(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}
