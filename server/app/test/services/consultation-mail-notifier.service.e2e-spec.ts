import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import {
  createSampleConsultation,
  createSampleParent,
  createSampleStudent,
  createSampleLecturer,
} from '../helpers/models.helpers';
import { ConsultationNotifier } from '../../src/services/consultations/consultation-mail-notifier.service';
import getAccount from '../../src/config/mail.account.configuration';
import { EmailService } from '../../src/services/email/email.service';
import { ITimeInverval } from '../../src/services/consultations/consultation-mail-notifier.interfaces';
import '../../src/utils/extensions/date.extentions';
import { DatabaseUtility } from './../helpers/database.helper';
import * as request from 'supertest';
import { ParentNotifier } from '../../src/services/consultations/parent-notifier';

interface Entity {
  id: string;
}

describe('Consultation Notifier', () => {
  let app: INestApplication;
  let emailService: EmailService;
  let notifier: ConsultationNotifier;
  const timeInterval: ITimeInverval = {
    shouldStartAfterMinutes: 0,
    shouldEndBeforeMinutes: 900,
  };
  let databaseUtility: DatabaseUtility;

  beforeAll(async () => {
    await loadApp();
    databaseUtility = await DatabaseUtility.init();
    await loadNotifier();
  });

  const loadApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  };

  const loadNotifier = async () => {
    const account = await getAccount();
    emailService = new EmailService(account);
    jest.spyOn(emailService, 'sendMail');
    const notifiers = [new ParentNotifier(emailService)];
    notifier = new ConsultationNotifier(timeInterval, notifiers);
  };

  beforeEach(async () => {
    await populateDatabase();
  });

  const populateDatabase = async () => {
    const parent = await createParent();
    const student = await createStudent([parent.id]);
    const lecturer = await createLecturer();
    await createConsultation([student.id], [lecturer.id]);
  };

  const createParent = async (): Promise<Entity> => {
    const parent = createSampleParent();
    const { body } = await request(app.getHttpServer())
      .post('/parents')
      .send(parent);
    return body;
  };

  const createStudent = async (parentIds: string[]): Promise<Entity> => {
    const student = createSampleStudent();
    student.parents = parentIds;
    const { body } = await request(app.getHttpServer())
      .post('/students')
      .send(student);
    return body;
  };

  const createLecturer = async (): Promise<Entity> => {
    const lecturer = createSampleLecturer();
    const { body } = await request(app.getHttpServer())
      .post('/lecturers')
      .send(lecturer);
    return body;
  };

  const createConsultation = async (
    studentIds: string[],
    lecturersIds: string[],
  ): Promise<Entity> => {
    const consultation = createSampleConsultation();

    consultation.datetime = new Date(
      new Date()
        .addHours(1)
        .addMinutes(15)
        .toUTCString(),
    );
    consultation.students = studentIds;
    consultation.lecturers = lecturersIds;

    const { body } = await request(app.getHttpServer())
      .post('/consultations')
      .send(consultation);

    return body;
  };

  afterEach(async () => {
    await databaseUtility.cleanDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should send emails', async () => {
    await notifier.notifyAboutConsultations();

    expect(emailService.sendMail).toHaveBeenCalled();
  });
});
