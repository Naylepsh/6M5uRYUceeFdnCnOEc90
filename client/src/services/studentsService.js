import http from "./httpService";

const apiEndpoint = "http://localhost:3333/students";

export function getStudents() {
  return http.get(apiEndpoint);
}

export function getStudent(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function saveStudent(student) {
  if (student.id) {
    return putStudent(student.id, student);
  } else {
    return postStudent(student);
  }
}

export function postStudent(student) {
  return http.post(`${apiEndpoint}`, student);
}

export function putStudent(id, student) {
  return http.put(`${apiEndpoint}/${id}`, student);
}

export function deleteStudent(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}
