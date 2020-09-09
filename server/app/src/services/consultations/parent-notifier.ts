import { EmailService } from '../email/email.service';
import {
  IConsultation,
  IStudent,
  IParent,
} from './consultation-mail-notifier.interfaces';
import { INotifier } from './notifier.interface';

export class ParentNotifier implements INotifier<IConsultation> {
  notificationsSentInPreviousRound = new Map();
  notificationsSentInCurrentRound = new Map();

  constructor(private readonly emailService: EmailService) {}

  public sendNotifications(
    upcomingConsultations: IConsultation[],
  ): Promise<any> {
    const mailsSent = [];

    for (const consultation of upcomingConsultations) {
      if (!consultation.students) break;

      for (const student of consultation.students) {
        const key = this.createKey(consultation, student);
        if (this.isEligableForNotification(student, key)) {
          const mailSent = this.sendMail(
            consultation,
            student,
            student.parents,
          );
          mailsSent.push(mailSent);
        }
        this.notificationsSentInCurrentRound.set(key, true);
      }
    }

    this.notificationsSentInPreviousRound = this.notificationsSentInCurrentRound;
    this.notificationsSentInCurrentRound = new Map();

    return Promise.all(mailsSent);
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
    return this.emailService.sendMail(sender, recipents, subject, body);
  }

  private createMailBody(
    consultationDatetime: Date,
    studentName: string,
  ): string {
    return `Your child ${studentName} is expected to come to consultations at ${consultationDatetime}`;
  }
}
