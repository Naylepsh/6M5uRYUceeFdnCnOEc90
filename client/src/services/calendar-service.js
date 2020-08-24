import {
  getFirstDayOfTheWeek,
  getDate,
  setDateToBeginningOfTheDay,
} from "./../utils/date";
import { ConsultationsService } from "./consultations-service";
import { ConsultationMapper } from "../utils/mappers/consultation-mapper";
import { addDays } from "date-fns";

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
    return addDays(new Date(initialDate), pagesInTheCalendar);
  }

  async getCalendar() {
    await this.loadData();
    return this.calendar;
  }

  async loadData() {
    await this.loadConsultations();
    this.calendar = this.fillCalendar(this.initialDate, this.consultations);
  }

  async loadConsultations() {
    const res = await this.consultationService.getConsultationsBetween(
      this.initialDate,
      this.lastDate
    );
    const rawConsultations = res.data;
    this.consultations = ConsultationMapper.fromConsAPIToCalendarCons(
      rawConsultations
    );
  }

  fillCalendar(initialDate) {
    const calendar = [];
    for (let week = 0; week < 5; week++) {
      const weekInitialDate = addDays(new Date(initialDate), week * 7);
      const dates = this.createWeekData(weekInitialDate);
      calendar.push(dates);
    }
    return calendar;
  }

  createWeekData(initialDate) {
    const days = [];
    for (let day = 0; day < 7; day++) {
      const date = addDays(new Date(initialDate), day);
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
