import "../utils/date-extentions";
import {
  getFirstDayOfTheWeek,
  getDate,
  setDateToBeginningOfTheDay,
} from "./../utils/date";
import { ConsultationsService } from "./consultations-service";

export class CalendarService {
  constructor(startDate) {
    const initialDate = getFirstDayOfTheWeek(startDate);
    this.initialDate = initialDate;
    this.lastDate = this.getLastDateOfTheCalendarPage(this.initialDate);
    this.consultationService = new ConsultationsService();
    this.calendar = [];
    this.consultations = [];
  }

  getLastDateOfTheCalendarPage(initialDate) {
    const pagesInTheCalendar = 35;
    return new Date(initialDate).addDays(pagesInTheCalendar);
  }

  async loadData() {
    await this.loadConsultations();
    console.log("consul", this.consultations);
    const calendar = this.createAndFillCalendar(
      this.initialDate,
      this.consultations
    );
    return calendar;
  }

  async loadConsultations() {
    const res = await this.consultationService.getConsultationsBetween(
      this.initialDate,
      this.lastDate
    );
    const rawConsultations = res.data;
    this.consultations = tidyUpConsultations(rawConsultations);
  }

  createAndFillCalendar(initialDate) {
    const calendar = [];
    for (let week = 0; week < 5; week++) {
      const weekInitialDate = new Date(initialDate).addDays(week * 7);
      const dates = this.createWeekData(weekInitialDate);
      calendar.push(dates);
    }
    return calendar;
  }

  createWeekData(initialDate) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      const date = new Date(initialDate).addDays(day);
      const dayData = this.createDayData(date);
      days.push(dayData);
    }
    return days;
  }

  createDayData(initialDate) {
    const datetime = new Date(initialDate);
    setDateToBeginningOfTheDay(datetime);
    const date = getDate(datetime);
    const posts = this.getConsultationsOfTheDate(date);
    const dayData = { date: datetime, posts };
    return dayData;
  }

  getConsultationsOfTheDate(date) {
    return this.consultations[date] || [];
  }
}

function tidyUpConsultations(consultations) {
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
