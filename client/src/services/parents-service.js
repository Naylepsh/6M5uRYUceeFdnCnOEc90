import http from "./httpService";

const apiEndpoint = "http://localhost:3333/parents";

export function getParents() {
  return http.get(apiEndpoint);
}

export function getParent(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function saveParent(parent) {
  if (parent.id) {
    return putParent(parent.id, parent);
  } else {
    return postParent(parent);
  }
}

export function postParent(parent) {
  return http.post(`${apiEndpoint}`, parent);
}

export function putParent(id, parent) {
  return http.put(`${apiEndpoint}/${id}`, parent);
}

export function deleteParent(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}
