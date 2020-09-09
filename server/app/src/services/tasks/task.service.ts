import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import getAccount from '../../config/mail.account.configuration';
import { ConsultationNotifier } from '../consultations/consultation-mail-notifier.service';
import { EmailService } from '../email/email.service';
import { ParentNotifier } from '../consultations/parent-notifier';

@Injectable()
export class TasksService {
  notifier: ConsultationNotifier;

  @Cron(CronExpression.EVERY_30_MINUTES)
  async notifyAboutConsultations(): Promise<void> {
    if (!this.notifier) {
      await this.initNotifier();
    }

    this.notifier.notifyParentsAboutTheirChildrenConsultations();
  }

  private async initNotifier(): Promise<void> {
    const account = await getAccount();
    const shouldLog = true;
    const emailService = new EmailService(account, shouldLog);
    const timeInterval = {
      shouldStartAfterMinutes: 60,
      shouldEndBeforeMinutes: 90,
    };
    const parentNotifier = new ParentNotifier(emailService);
    this.notifier = new ConsultationNotifier(timeInterval, [parentNotifier]);
  }
}
