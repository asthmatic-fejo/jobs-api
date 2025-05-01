import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './job.entity';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() jobData: Partial<Job>): Promise<Job> {
    return this.jobsService.create(jobData);
  }

  @Get()
  search(@Query('q') query: string) {
    return this.jobsService.search(query);
  }

  @Get('/active')
  async findActiveJobs() {
    return this.jobsService.findActiveJobs();
  }
}
