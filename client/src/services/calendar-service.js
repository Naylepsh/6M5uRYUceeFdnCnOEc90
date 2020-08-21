import "../utils/date-extentions";
import { getConsultationsBetween } from "./consultations-service";

export async function createCalendarData(startDate) {
  const initialDate = getFirstDayOfTheWeek(startDate);
  const lastDate = getLastDateOfTheCalendarPage(initialDate);
  const consultations = await getConsultations(initialDate, lastDate);
  const calendar = createAndFillCalendar(initialDate, consultations);
  return calendar;
}

// surprisingly it's Sunday that is considered first day of the week, not Monday :shrug:
function getFirstDayOfTheWeek(date) {
  const currentDay = date.getDay();
  const daysToSubtract = currentDay;
  const firstDayOfTheWeek = new Date().subtractDays(daysToSubtract);
  return firstDayOfTheWeek;
}

function getLastDateOfTheCalendarPage(initialDate) {
  const pagesInTheCalendar = 35;
  return new Date(initialDate).addDays(pagesInTheCalendar);
}

async function getConsultations(initialDate, lastDate) {
  const res = await getConsultationsBetween(initialDate, lastDate);
  const rawConsultations = res.data;
  const cleanedUpConsultations = tidyUpConsultations(rawConsultations);
  return cleanedUpConsultations;
}

function tidyUpConsultations(consultations) {
  const dates = {};
  for (const consultation of consultations) {
    const date = getDate(consultation.datetime);
    if (!dates[date]) {
      dates[date] = [];
    }
    dates[date].push(consultation);
  }
  return dates;
}

function getDate(datetime) {
  return `${datetime.getDate()}-${
    datetime.getMonth() + 1
  }-${datetime.getYear()}`;
}

function createAndFillCalendar(initialDate, consultations) {
  const calendar = [];
  for (let week = 0; week < 5; week++) {
    const weekInitialDate = new Date(initialDate).addDays(week * 7);
    const dates = createWeekData(weekInitialDate, consultations);
    calendar.push(dates);
  }
  return calendar;
}

function createWeekData(initialDate, consultations) {
  const days = [];
  for (let day = 0; day < 7; day++) {
    const date = new Date(initialDate).addDays(day);
    setDateToBeginningOfTheDay(date);
    const posts = [];
    const dayData = { date, posts };
    days.push(dayData);
  }
  return days;
}

function setDateToBeginningOfTheDay(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
}
