import { EmailService } from '../email/email.service';
import getAccount from '../../config/mail.account.configuration';
import '../../utils/extensions/date.extentions';
import { LecturerNotifier } from './lecturer-notifier';

describe('ConsultationNotifier', () => {
  let notifier: LecturerNotifier;
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
        lecturers: [{ id: '1', email: 'lecturer1@mail.com' }],
      },
    ];
  };

  const loadEmailService = async () => {
    const account = await getAccount();
    emailService = new EmailService(account);
    jest.spyOn(emailService, 'sendMail').mockImplementation(() => null);
  };

  const loadNotifier = () => {
    notifier = new LecturerNotifier(emailService);
  };

  it('should send mails', async () => {
    notifier.sendNotifications(consultations);

    expect(emailService.sendMail).toHaveBeenCalled();
  });

  it('should notify only once per unique (consultation, lecturer)', async () => {
    notifier.sendNotifications(consultations);
    notifier.sendNotifications(consultations);

    expect(emailService.sendMail).toHaveBeenCalledTimes(1);
  });
});
