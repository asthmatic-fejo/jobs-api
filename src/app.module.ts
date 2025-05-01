import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './jobs/job.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'jobs.db',
      entities: [Job],
      synchronize: true,
    }),
    JobsModule,
  ]
})
export class AppModule {}
