export interface ITimeFrame {
  startDatetime: Date;
  endDatetime: Date;
}

export interface ITimeInverval {
  shouldStartAfterMinutes: number;
  shouldEndBeforeMinutes: number;
}

export interface IConsultation {
  id: string;
  datetime: Date;
  students: IStudent[];
}

export interface IStudent {
  id: string;
  firstName: string;
  parents: IParent[];
}

export interface IParent {
  email: string;
}
