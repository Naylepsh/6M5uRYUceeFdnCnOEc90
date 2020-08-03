'use strict';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SentMessageInfo } from 'nodemailer/lib/smtp-connection';

export class EmailService {
  transporter: Mail;
  constructor(
    private readonly transportOptions: SMTPTransport.Options,
    private readonly shouldLog: boolean = false,
  ) {
    this.transporter = nodemailer.createTransport(transportOptions);
  }

  async sendMail(
    sender: string,
    recipents: string[],
    subject: string,
    text: string,
  ): Promise<SentMessageInfo> {
    try {
      const senderAddress = `"${sender}" <${this.transportOptions.auth.user}>`;
      const listOfReceivers = recipents.join(', ');
      const info = await this.transporter.sendMail({
        from: senderAddress,
        to: listOfReceivers,
        subject,
        text,
      });

      if (this.shouldLog) {
        this.log(info);
      }

      return info;
    } catch (err) {
      console.log(err);
    }
  }

  log(info: SMTPTransport.SentMessageInfo): void {
    console.log('Message sent: %s', info.messageId);

    // Preview only available when sending through an Ethereal account
    if (this.transportOptions.service === 'ethereal')
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
