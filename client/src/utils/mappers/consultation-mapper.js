import { getDate } from "../date";

export class ConsultationMapper {
  static fromConsAPIToCalendarCons(consultations) {
    const dates = {};
    for (const consultation of consultations) {
      const datetime = new Date(consultation.datetime);
      const date = getDate(datetime);
      if (!dates[date]) {
        dates[date] = [];
      }
      dates[date].push(consultation);
    }
    return dates;
  }
}
