import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import getAccount from '../../config/mail.account.configuration';
import { ConsultationNotifier } from '../consultations/consultation-mail-notifier.service';
import { EmailService } from '../email/email.service';
import { ParentNotifier } from '../consultations/parent-notifier';
import { LecturerNotifier } from '../consultations/lecturer-notifier';

@Injectable()
export class TasksService {
  notifier: ConsultationNotifier;

  @Cron(CronExpression.EVERY_30_MINUTES)
  async notifyAboutConsultations(): Promise<void> {
    if (!this.notifier) {
      await this.initNotifier();
    }

    this.notifier.notifyAboutConsultations();
  }

  private async initNotifier(): Promise<void> {
    const emailService = await this.createMailService();
    const notifiers = this.createMailNotifiers(emailService);
    const timeInterval = {
      shouldStartAfterMinutes: 60,
      shouldEndBeforeMinutes: 90,
    };

    this.notifier = new ConsultationNotifier(timeInterval, notifiers);
  }

  private createMailNotifiers(emailService: EmailService) {
    const parentNotifier = new ParentNotifier(emailService);
    const lecturerNotifier = new LecturerNotifier(emailService);
    const notifiers = [parentNotifier, lecturerNotifier];
    return notifiers;
  }

  private async createMailService() {
    const account = await getAccount();
    const shouldLog = true;
    const emailService = new EmailService(account, shouldLog);
    return emailService;
  }
}
