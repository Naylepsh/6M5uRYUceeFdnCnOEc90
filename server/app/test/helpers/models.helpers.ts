import * as faker from 'faker';
import '../../src/utils/extensions/date.extentions';

interface IStudent {
  firstName: string;
  lastName: string;
  groups: string[];
  parents: string[];
  consultations: string[];
}

interface IParent {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  children: string[];
}

interface IGroup {
  day: string;
  time: string;
  address: string;
  room: string;
  startDate: string;
  endDate: string;
  lecturers: string[];
  students: string[];
}

interface ILecturer {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  groups: string[];
  consultations: string[];
}

interface IConsultation {
  datetime: Date;
  address: string;
  room: string;
  description: string;
  lecturers: string[];
  students: string[];
}

export function createSampleStudent(): IStudent {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    groups: [],
    parents: [],
    consultations: [],
  };
}

export function createSampleGroup(): IGroup {
  const startDate = faker.date.future();
  const endDate = startDate
    .addHours(faker.random.number())
    .addMinutes(faker.random.number());
  return {
    day: faker.date.weekday(),
    time: randomTime(),
    address: faker.address.streetName(),
    room: faker.random.number() + '',
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    lecturers: [],
    students: [],
  };
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function randomTime(): string {
  const time = faker.date.past();
  return `${time.getHours()}:${time.getMinutes()}`;
}

export function createSampleLecturer(): ILecturer {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    groups: [],
    consultations: [],
  };
}

export function createSampleParent(): IParent {
  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    children: [],
  };
}

export function createSampleConsultation(): IConsultation {
  return {
    datetime: faker.date.future(),
    address: faker.address.streetName(),
    room: faker.random.number() + '',
    description: faker.commerce.product(),
    lecturers: [],
    students: [],
  };
}
