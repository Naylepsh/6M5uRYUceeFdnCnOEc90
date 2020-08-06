import http from "./httpService";

const apiEndpoint = "http://localhost:3333/groups";

export function getGroups() {
  return http.get(apiEndpoint);
}

export function getGroup(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function saveGroup(group) {
  if (group.id) {
    return putGroup(group.id, group);
  } else {
    return postGroup(group);
  }
}

export function postGroup(group) {
  return http.post(`${apiEndpoint}`, group);
}

export function putGroup(id, group) {
  return http.put(`${apiEndpoint}/${id}`, group);
}

export function deleteGroup(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}
