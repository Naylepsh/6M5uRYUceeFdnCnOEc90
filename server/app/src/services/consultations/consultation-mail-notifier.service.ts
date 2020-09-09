import { getConnection, Between } from 'typeorm';
import {
  ITimeInverval,
  ITimeFrame,
  IConsultation,
} from './consultation-mail-notifier.interfaces';
import { INotifier } from './notifier.interface';
import { ConsultationRepository } from '../../repositories/consultation.repository';
import '../../utils/extensions/date.extentions';

export class ConsultationNotifier {
  notificationsSentInPreviousRound = new Map();
  notificationsSentInCurrentRound = new Map();

  constructor(
    private readonly timeIntervalInMinutes: ITimeInverval,
    private readonly notifiers: INotifier<IConsultation>[],
  ) {}

  public async notifyAboutConsultations(): Promise<void> {
    const timeFrame = this.createTimeFrame();
    const upcommingConsultations = await this.getUpcomingConsultations(
      timeFrame,
    );
    this.sendNotifications(upcommingConsultations);
  }

  private createTimeFrame(): ITimeFrame {
    const now = new Date();
    return {
      startDatetime: new Date(now).addMinutes(
        this.timeIntervalInMinutes.shouldStartAfterMinutes,
      ),
      endDatetime: new Date(now).addMinutes(
        this.timeIntervalInMinutes.shouldEndBeforeMinutes,
      ),
    };
  }

  // has to be set to public as otherwise it won't be mockable with jest
  public async getUpcomingConsultations(
    timeFrame: ITimeFrame,
  ): Promise<IConsultation[]> {
    let res: IConsultation[];

    try {
      const connection = getConnection();
      const repo = new ConsultationRepository(connection);

      // some dirty mumbo jumbo with dates cause without it database has problem comparing the dates?!
      const query = {
        where: {
          datetime: Between(
            new Date(timeFrame.startDatetime.toUTCString()).toISOString(),
            new Date(timeFrame.endDatetime.toUTCString()).toISOString(),
          ),
        },
      };
      res = await repo.findAll(query);
    } catch (err) {
      console.error(err);
      res = [];
    } finally {
      return res;
    }
  }

  private sendNotifications(upcomingConsultations: IConsultation[]): void {
    for (const notifier of this.notifiers) {
      notifier.sendNotifications(upcomingConsultations);
    }
  }
}
