import getAccount from '../../config/mail.account.configuration';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const account = await getAccount();
    emailService = new EmailService(account);
  });

  it('should send mail', async () => {
    const sender = 'acc@mail.com';
    const recipents = ['recp@mail.com'];
    const subject = 'important subject';
    const body = 'a simple text message';

    const res = await emailService.sendMail(sender, recipents, subject, body);

    expect(res).toBeDefined();
    expect(res).toHaveProperty('messageId');
  });
});
