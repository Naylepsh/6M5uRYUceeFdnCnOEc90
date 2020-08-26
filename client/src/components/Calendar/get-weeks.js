import { CalendarService } from "../../services/calendar-service";

export function getWeeks(date) {
  const dataLoader = new CalendarService(date);
  return dataLoader.getCalendar();
}
