import { Controller, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './job.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() jobData: Partial<Job>): Promise<Job> {
    return this.jobsService.create(jobData);
  }
}
