import http from "./http-service";

export class ConsultationsService {
  constructor() {
    this.apiEndpoint = "http://localhost:3333/consultations";
  }

  getConsultations() {
    return http.get(this.apiEndpoint);
  }

  getConsultationsBetween(startDate, endDate) {
    const query = `between[]=${startDate}&between[]=${endDate}`;
    return http.get(`${this.apiEndpoint}?${query}`);
  }

  getConsultation(id) {
    return http.get(`${this.apiEndpoint}/${id}`);
  }

  saveConsultation(consultation) {
    if (consultation.id) {
      return this.putConsultation(consultation.id, consultation);
    } else {
      return this.postConsultation(consultation);
    }
  }

  postConsultation(consultation) {
    return http.post(`${this.apiEndpoint}`, consultation);
  }

  putConsultation(id, consultation) {
    return http.put(`${this.apiEndpoint}/${id}`, consultation);
  }

  deleteConsultation(id) {
    return http.delete(`${this.apiEndpoint}/${id}`);
  }
}
