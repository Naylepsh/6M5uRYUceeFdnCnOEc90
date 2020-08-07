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
import { Repository } from 'typeorm';
import { Consultation } from '../../models/consultation.model';

export class ConsultationNotifier {
  notificationsSentInPreviousRound = new Map();

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
      const repo = new ConsultationRepository(new Repository<Consultation>());

      res = await repo.findAllBetween(
        timeFrame.startDatetime.toISOString(),
        timeFrame.endDatetime.toISOString(),
      );
    } catch (err) {
      res = [];
    } finally {
      return res;
    }
  }

  private sendNotifications(upcomingConsultations: IConsultation[]): void {
    const notificationsSentInCurrentRound = new Map();
    for (const consultation of upcomingConsultations) {
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
