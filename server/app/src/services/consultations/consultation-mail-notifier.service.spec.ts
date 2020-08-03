import { ConsultationNotifier } from './consultation-mail-notifier.service';
import { EmailService } from '../email/email.service';
import getAccount from '../../config/mail.account.configuration';
import '../../utils/extensions/date.extentions';

describe('ConsultationNotifier', () => {
  let notifier: ConsultationNotifier;
  let emailService: EmailService;
  let consultations;

  beforeEach(async () => {
    loadConsultations();
    await loadEmailService();
    loadNotifier();
  });

  const loadConsultations = () => {
    consultations = [
      {
        datetime: new Date().addMinutes(15),
        students: [
          {
            firstName: 'John',
            parents: [
              {
                email: 'parent@mail.com',
              },
            ],
          },
        ],
      },
    ];
  };

  const loadEmailService = async () => {
    const account = await getAccount();
    emailService = new EmailService(account);
    jest.spyOn(emailService, 'sendMail').mockImplementation(() => null);
  };

  const loadNotifier = () => {
    const timeInterval = {
      shouldStartAfterNMinutes: 10,
      shouldEndBeforeNMinutes: 20,
    };
    const appUrl = 'mocked-url.com';
    notifier = new ConsultationNotifier(emailService, timeInterval, appUrl);
    jest
      .spyOn(notifier, 'getUpcommingConsultations')
      .mockImplementation(() => consultations);
  };

  it('should send mails to parents of students signed up for upcomming consultations', async () => {
    await notifier.notifyParentsAboutTheirChildrenConsultations();

    expect(emailService.sendMail).toHaveBeenCalled();
  });

  it('should notify only once per unique (consultation, student, parent)', async () => {
    await notifier.notifyParentsAboutTheirChildrenConsultations();
    await notifier.notifyParentsAboutTheirChildrenConsultations();

    expect(emailService.sendMail).toHaveBeenCalledTimes(1);
  });
});
