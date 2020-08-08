import { EmailService } from '../email/email.service';
import {
  ITimeInverval,
  ITimeFrame,
  IConsultation,
  IParent,
  IStudent,
} from './consultation-mail-notifier.interfaces';
import { ConsultationRepository } from '../../repositories/consultation.repository';
import '../../utils/extensions/date.extentions';
import { getConnection } from 'typeorm';

export class ConsultationNotifier {
  notificationsSentInPreviousRound = new Map();
  notificationsSentInCurrentRound = new Map();

  constructor(
    private readonly emailService: EmailService,
    private readonly timeIntervalInMinutes: ITimeInverval,
  ) {}

  public async notifyParentsAboutTheirChildrenConsultations(): Promise<void> {
    const timeFrame = this.createTimeFrame();
    const upcommingConsultations = await this.getUpcomingConsultations(
      timeFrame,
    );
    this.sendNotifications(upcommingConsultations);
  }

  private createTimeFrame(): ITimeFrame {
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
  public async getUpcomingConsultations(
    timeFrame: ITimeFrame,
  ): Promise<IConsultation[]> {
    let res: IConsultation[];

    try {
      const connection = getConnection();
      const repo = new ConsultationRepository(connection);

      // some dirty mumbo jumbo with dates cause without it database has problem comparing the dates?!
      res = await repo.findAllBetween(
        new Date(timeFrame.startDatetime.toUTCString()).toISOString(),
        new Date(timeFrame.endDatetime.toUTCString()).toISOString(),
      );
    } catch (err) {
      res = [];
    } finally {
      return res;
    }
  }

  private sendNotifications(upcomingConsultations: IConsultation[]): void {
    for (const consultation of upcomingConsultations) {
      if (!consultation.students) break;
      for (const student of consultation.students) {
        const key = this.createKey(consultation, student);
        if (this.isEligableForNotification(student, key))
          this.sendMail(consultation, student, student.parents);
        this.notificationsSentInCurrentRound.set(key, true);
      }
    }
    this.notificationsSentInPreviousRound = this.notificationsSentInCurrentRound;
    this.notificationsSentInCurrentRound = new Map();
  }

  private createKey(consultation: IConsultation, student: IStudent): string {
    return consultation.id + student.id;
  }

  private isEligableForNotification(student: IStudent, key: string) {
    return (
      !this.notificationsSentInPreviousRound.has(key) &&
      student.parents &&
      student.parents.length > 0
    );
  }

  private sendMail(
    consultation: IConsultation,
    student: IStudent,
    parents: IParent[],
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
