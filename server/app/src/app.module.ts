import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import controllers from './controllers/';
import databaseConfiguration from './config/database.configuration';
import { TasksService } from './services/tasks/task.service';
import { ConsultationRepository } from './repositories/consultation.repository';
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfiguration),
    ScheduleModule.forRoot(),
  ],
  controllers,
  providers: [ConsultationRepository],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
