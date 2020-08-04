export interface TimeFrame {
  startDatetime: Date;
  endDatetime: Date;
}

export interface TimeInverval {
  shouldStartAfterMinutes: number;
  shouldEndBeforeMinutes: number;
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
