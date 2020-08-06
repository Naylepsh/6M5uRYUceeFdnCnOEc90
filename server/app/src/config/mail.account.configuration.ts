import config from './configuration';
import * as nodemailer from 'nodemailer';
import * as SMTPTransport from 'nodemailer/lib/smtp-transport';

const transportOptions = config.smptTransport;

interface IAuth {
  user: string;
  pass: string;
}

export default async function getAccount(): Promise<SMTPTransport.Options> {
  const env = process.env.NODE_ENV || 'dev';
  let auth: IAuth;
  if (env == 'test' || env == 'dev') {
    const testAccount = await nodemailer.createTestAccount();
    auth = {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    };
  } else if (env == 'prod') {
    auth = {
      user: process.env.MAIL_PROD_USERNAME,
      pass: process.env.MAIL_PROD_PASSWORD,
    };
  }

  return { ...transportOptions, auth };
}
