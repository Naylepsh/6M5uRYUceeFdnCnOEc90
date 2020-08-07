import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { ParentRepository } from '../../src/repositories/parent.repository';
import { StudentRepository } from '../../src/repositories/student.repository';
import { ConsultationRepository } from '../../src/repositories/consultation.repository';
import {
  createSampleConsultation,
  createSampleParent,
  createSampleStudent,
} from '../helpers/models.helpers';
import { getConnection } from 'typeorm';
import { ConsultationNotifier } from '../../src/services/consultations/consultation-mail-notifier.service';
import getAccount from '../../src/config/mail.account.configuration';
import { EmailService } from '../../src/services/email/email.service';
import { ITimeInverval } from '../../src/services/consultations/consultation-mail-notifier.interfaces';
import '../../src/utils/extensions/date.extentions';

interface Entity {
  id: string;
}

describe('Consultation Notifier', () => {
  let app: INestApplication;
  let parentRepository: ParentRepository;
  let studentRepository: StudentRepository;
  let consultationRepository: ConsultationRepository;
  let emailService: EmailService;
  let notifier: ConsultationNotifier;
  const timeInterval: ITimeInverval = {
    shouldStartAfterMinutes: 60,
    shouldEndBeforeMinutes: 90,
  };

  beforeAll(async () => {
    await loadApp();
    loadRepositories();
    await loadNotifier();
  });

  const loadApp = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  };

  const loadRepositories = () => {
    parentRepository = new ParentRepository();
    studentRepository = new StudentRepository();
    consultationRepository = new ConsultationRepository();
  };

  const loadNotifier = async () => {
    const account = await getAccount();
    emailService = new EmailService(account);
    jest.spyOn(emailService, 'sendMail');
    notifier = new ConsultationNotifier(emailService, timeInterval);
  };

  beforeEach(async () => {
    populateDatabase();
  });

  const populateDatabase = async () => {
    const parent = await createParent();
    const student = await createStudent([parent.id]);
    await createConsultation([student.id]);
  };

  const createParent = (): Promise<Entity> => {
    const parent = createSampleParent();
    return parentRepository.create(parent);
  };

  const createStudent = (parentIds: string[]): Promise<Entity> => {
    const student = createSampleStudent();
    student.parents = parentIds;
    return studentRepository.create(student);
  };

  const createConsultation = (studentIds: string[]): Promise<Entity> => {
    const consultation = createSampleConsultation();
    consultation.datetime = new Date(
      new Date()
        .addHours(1)
        .addMinutes(15)
        .toUTCString(),
    );
    consultation.students = studentIds;
    return consultationRepository.create(consultation);
  };

  afterEach(async () => {
    await cleanDatabase();
  });

  const cleanDatabase = () => {
    return getConnection().synchronize(true);
  };

  afterAll(async () => {
    await app.close();
  });

  it('should send emails', async () => {
    await notifier.notifyParentsAboutTheirChildrenConsultations();

    expect(emailService.sendMail).toHaveBeenCalled();
  });
});
