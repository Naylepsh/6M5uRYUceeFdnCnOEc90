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
  lecturers: ILecturer[];
}

export interface IStudent {
  id: string;
  firstName: string;
  parents: IParent[];
}

export interface IParent {
  email: string;
}

export interface ILecturer {
  id: string;
  email: string;
}
