import { subDays } from "date-fns";

// surprisingly it's Sunday that is considered first day of the week, not Monday :shrug:
export function getFirstDayOfTheWeek(date) {
  const currentDay = date.getDay();
  const daysToSubtract = currentDay;
  const firstDayOfTheWeek = subDays(new Date(date), daysToSubtract);
  return firstDayOfTheWeek;
}

export function getDate(datetime) {
  return `${datetime.getDate()}-${
    datetime.getMonth() + 1
  }-${datetime.getYear()}`;
}

export function setDateToBeginningOfTheDay(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
}
