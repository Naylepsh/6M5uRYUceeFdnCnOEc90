export interface TimeFrame {
  startDatetime: Date;
  endDatetime: Date;
}

export interface TimeInverval {
  shouldStartAfterNMinutes: number;
  shouldEndBeforeNMinutes: number;
}

export interface Consultation {
  id: string;
  datetime: Date;
}

export interface Student {
  id: string;
  firstName: string;
}

export interface Parent {
  email: string;
}
