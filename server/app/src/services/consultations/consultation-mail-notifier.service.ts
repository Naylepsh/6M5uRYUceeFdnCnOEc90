import axios from 'axios';
import { EmailService } from '../email/email.service';

interface TimeFrame {
  startDatetime: Date;
  endDatetime: Date;
}

interface TimeInverval {
  shouldStartAfterNMinutes: number;
  shouldEndBeforeNMinutes: number;
}

interface Consultation {
  datetime: Date;
}

interface Student {
  firstName: string;
}

interface Parent {
  email: string;
}

export class ConsultationNotifier {
  constructor(
    private readonly emailService: EmailService,
    private readonly timeIntervalInMinutes: TimeInverval,
    private readonly appUrl: string,
  ) {}

  public async notifyParentsAboutTheirChildrenConsultations(): Promise<void> {
    const timeFrame = this.createTimeFrame();
    const upcommingConsultations = await this.getUpcommingConsultations(
      timeFrame,
    );
    this.sendNotifications(upcommingConsultations);
    this.emailService.sendMail('', [], '', '');
  }

  private createTimeFrame(): TimeFrame {
    const now = new Date();
    return {
      startDatetime: now.addMinutes(
        this.timeIntervalInMinutes.shouldStartAfterNMinutes,
      ),
      endDatetime: now.addMinutes(
        this.timeIntervalInMinutes.shouldEndBeforeNMinutes,
      ),
    };
  }

  // has to be set to public as otherwise it won't be mockable with jest
  public async getUpcommingConsultations(timeFrame: TimeFrame): Promise<any> {
    const query = ConsultationNotifier.createTimeFrameQuery(timeFrame);
    const { body } = await axios.get(`${this.appUrl}/consultations${query}`);
    return body;
  }

  private static createTimeFrameQuery(timeFrame: TimeFrame): string {
    const { startDatetime, endDatetime } = timeFrame;
    return `?between[]="${startDatetime}"&between[]="${endDatetime}"`;
  }

  private sendNotifications(upcommingConsultations: any): void {
    for (const consultation of upcommingConsultations) {
      for (const student of consultation.students) {
        this.sendMail(consultation, student, student.parents);
      }
    }
  }

  private sendMail(
    consultation: Consultation,
    student: Student,
    parents: Parent[],
  ) {
    const sender = 'logity consultation reminder service';
    const recipents = parents.map(parent => parent.email);
    const subject = 'consultation reminder';
    const body = this.createMailBody(consultation.datetime, student.firstName);
    this.emailService.sendMail(sender, recipents, subject, body);
  }

  private createMailBody(
    consultationDatetime: Date,
    studentName: string,
  ): string {
    return `Your child ${studentName} is expected to come to consultations at ${consultationDatetime}`;
  }
}
