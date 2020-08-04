import { EmailService } from '../email/email.service';
import {
  TimeInverval,
  TimeFrame,
  Consultation,
  Parent,
  Student,
} from './consultation-mail-notifier.interfaces';
import { ConsultationRepository } from '../../repositories/consultation.repository';

export class ConsultationNotifier {
  notificationsSentInPreviousRound = new Map();

  constructor(
    private readonly emailService: EmailService,
    private readonly timeIntervalInMinutes: TimeInverval,
  ) {}

  public async notifyParentsAboutTheirChildrenConsultations(): Promise<void> {
    const timeFrame = this.createTimeFrame();
    const upcommingConsultations = await this.getUpcommingConsultations(
      timeFrame,
    );
    this.sendNotifications(upcommingConsultations);
  }

  private createTimeFrame(): TimeFrame {
    const now = new Date();
    return {
      startDatetime: new Date(now).addMinutes(
        this.timeIntervalInMinutes.shouldStartAfterMinutes,
      ),
      endDatetime: new Date(now).addMinutes(
        this.timeIntervalInMinutes.shouldEndBeforeMinutes,
      ),
    };
  }

  // has to be set to public as otherwise it won't be mockable with jest
  public async getUpcommingConsultations(timeFrame: TimeFrame): Promise<any> {
    const repo = new ConsultationRepository();
    return repo.findAllBetween(
      timeFrame.startDatetime.toISOString(),
      timeFrame.endDatetime.toISOString(),
    );
  }

  private sendNotifications(upcommingConsultations: any): void {
    const notificationsSentInCurrentRound = new Map();
    for (const consultation of upcommingConsultations) {
      for (const student of consultation.students) {
        const key = consultation.id + student.id;
        if (!this.notificationsSentInPreviousRound.has(key))
          this.sendMail(consultation, student, student.parents);
        notificationsSentInCurrentRound.set(key, true);
      }
    }
    this.notificationsSentInPreviousRound = notificationsSentInCurrentRound;
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
