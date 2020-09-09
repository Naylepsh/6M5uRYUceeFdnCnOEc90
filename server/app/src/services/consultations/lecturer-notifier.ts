import { EmailService } from '../email/email.service';
import {
  IConsultation,
  ILecturer,
} from './consultation-mail-notifier.interfaces';
import { INotifier } from './notifier.interface';

export class LecturerNotifier implements INotifier<IConsultation> {
  notificationsSentInPreviousRound = new Map();
  notificationsSentInCurrentRound = new Map();

  constructor(private readonly emailService: EmailService) {}

  public sendNotifications(
    upcomingConsultations: IConsultation[],
  ): Promise<any> {
    const mailsSent = [];

    for (const consultation of upcomingConsultations) {
      if (!consultation.lecturers) break;

      for (const lecturer of consultation.lecturers) {
        const key = this.createKey(consultation, lecturer);
        if (this.isEligableForNotification(key)) {
          const mailSent = this.sendMail(consultation, lecturer);
          mailsSent.push(mailSent);
        }
        this.notificationsSentInCurrentRound.set(key, true);
      }
    }

    this.notificationsSentInPreviousRound = this.notificationsSentInCurrentRound;
    this.notificationsSentInCurrentRound = new Map();

    return Promise.all(mailsSent);
  }

  private createKey(consultation: IConsultation, lecturer: ILecturer): string {
    return consultation.id + lecturer.id;
  }

  private isEligableForNotification(key: string) {
    return !this.notificationsSentInPreviousRound.has(key);
  }

  private sendMail(consultation: IConsultation, lecturer: ILecturer) {
    const sender = 'logity consultation reminder service';
    const recipents = [lecturer.email];
    const subject = 'consultation reminder';
    const body = this.createMailBody(consultation.datetime);
    return this.emailService.sendMail(sender, recipents, subject, body);
  }

  private createMailBody(consultationDatetime: Date): string {
    return `Your consultations start at ${consultationDatetime}`;
  }
}
