import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import controllers from './controllers/';
import databaseConfiguration from './config/database.configuration';
import { TasksService } from './services/tasks/task.service';
import { ConsultationRepository } from './repositories/consultation.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfiguration),
    TypeOrmModule.forFeature([ConsultationRepository]),
    ScheduleModule.forRoot(),
  ],
  controllers,
  providers: [ConsultationRepository, TasksService],
})
export class AppModule {}
