import http from "./http-service";

const apiEndpoint = "http://localhost:3333/consultations";

export function getConsultations() {
  return http.get(apiEndpoint);
}

export function getConsultationsBetween(startDate, endDate) {
  const query = `between[]=${startDate}&between[]=${endDate}`;
  return http.get(`${apiEndpoint}?${query}`);
}

export function getConsultation(id) {
  return http.get(`${apiEndpoint}/${id}`);
}

export function saveConsultation(consultation) {
  if (consultation.id) {
    return putConsultation(consultation.id, consultation);
  } else {
    return postConsultation(consultation);
  }
}

export function postConsultation(consultation) {
  return http.post(`${apiEndpoint}`, consultation);
}

export function putConsultation(id, consultation) {
  return http.put(`${apiEndpoint}/${id}`, consultation);
}

export function deleteConsultation(id) {
  return http.delete(`${apiEndpoint}/${id}`);
}
