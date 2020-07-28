import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import controllers from './controllers/';
import repositories from './repositories';
import databaseConfiguration from './config/database.configuration';

@Module({
  imports: [TypeOrmModule.forRoot(databaseConfiguration)],
  controllers,
  providers: [...repositories],
})
export class AppModule {}
