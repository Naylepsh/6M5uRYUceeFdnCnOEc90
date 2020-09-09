import { ConsultationNotifier } from './consultation-mail-notifier.service';
import { ParentNotifier } from './parent-notifier';
import { LecturerNotifier } from './lecturer-notifier';
import { EmailService } from '../email/email.service';
import getAccount from '../../config/mail.account.configuration';
import '../../utils/extensions/date.extentions';

describe('ConsultationNotifier', () => {
  let notifier: ConsultationNotifier;
  let parentNotifier: ParentNotifier;
  let lecturerNotifier: LecturerNotifier;
  let consultations;

  beforeEach(async () => {
    loadConsultations();
    const emailService = await loadEmailService();
    loadNotifier(emailService);
  });

  const loadConsultations = () => {
    consultations = [
      {
        datetime: new Date().addMinutes(15),
        lectures: [{ id: '1', email: 'lecturer@mail.com' }],
        students: [
          {
            id: '1',
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
    const emailService = new EmailService(account);

    jest.spyOn(emailService, 'sendMail').mockImplementation(() => null);

    return emailService;
  };

  const loadNotifier = (emailService: EmailService) => {
    const timeInterval = {
      shouldStartAfterMinutes: 10,
      shouldEndBeforeMinutes: 20,
    };
    parentNotifier = new ParentNotifier(emailService);
    lecturerNotifier = new LecturerNotifier(emailService);
    notifier = new ConsultationNotifier(timeInterval, [
      parentNotifier,
      lecturerNotifier,
    ]);

    jest.spyOn(parentNotifier, 'sendNotifications');
    jest.spyOn(lecturerNotifier, 'sendNotifications');
    jest
      .spyOn(notifier, 'getUpcomingConsultations')
      .mockImplementation(() => consultations);
  };

  it('should send mails to parents of students signed up for upcomming consultations', async () => {
    await notifier.notifyAboutConsultations();

    expect(parentNotifier.sendNotifications).toHaveBeenCalled();
  });

  it('should send mails to lecturers leading upcomming consultations', async () => {
    await notifier.notifyAboutConsultations();

    expect(lecturerNotifier.sendNotifications).toHaveBeenCalled();
  });
});
