import "../utils/date-extentions";

export function createCalendarData(startDate) {
  const initialDate = getFirstDayOfTheWeek(startDate);
  const calendar = createAndFillCalendar(initialDate);
  return calendar;
}

// surprisingly it's Sunday that is considered first day of the week, not Monday :shrug:
function getFirstDayOfTheWeek(date) {
  const currentDay = date.getDay();
  const daysToSubtract = currentDay;
  const firstDayOfTheWeek = new Date().subtractDays(daysToSubtract);
  return firstDayOfTheWeek;
}

function createAndFillCalendar(initialDate) {
  const calendar = [];
  for (let week = 0; week < 5; week++) {
    const dates = createWeekData(initialDate, week);
    calendar.push(dates);
  }
  return calendar;
}

function createWeekData(initialDate, week) {
  const dates = [];
  for (let day = 0; day < 7; day++) {
    const dateData = createDateData(initialDate, week, day);
    dates.push(dateData);
  }
  return dates;
}

function createDateData(initialDate, week, day) {
  const date = new Date(initialDate).addDays(week * 7 + day);
  setDateToBeginningOfTheDay(date);
  const posts = [];
  return { date, posts };
}

function setDateToBeginningOfTheDay(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
}
