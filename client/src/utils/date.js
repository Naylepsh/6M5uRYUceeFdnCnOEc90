import { subDays } from "date-fns";

// surprisingly it's Sunday that is considered first day of the week, not Monday :shrug:
export function getFirstDayOfTheWeek(date) {
  const currentDay = date.getDay() - 1; //fixed by substracting one
  const daysToSubtract = currentDay;
  const firstDayOfTheWeek = subDays(new Date(date), daysToSubtract);
  return firstDayOfTheWeek;
}

export function getDate(datetime) {
  const date = new Date(datetime);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export function setDateToBeginningOfTheDay(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
}
