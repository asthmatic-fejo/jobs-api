import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Job } from './job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {
  }

  async create(jobData: Partial<Job>): Promise<Job> {
    const job = this.jobRepository.create(jobData);
    return this.jobRepository.save(job);
  }

  async search(query: string): Promise<Job[]> {
    const words = query.split(/\s+/);
    const conditions = words.map(word => ([
      { title: Like(`%${word}%`), isActive: true },
      { description: Like(`%${word}%`), isActive: true },
    ])).flat();

    return this.jobRepository.find({
      where: conditions,
    });
  }

  async findActiveJobs(): Promise<Job[]> {
    return this.jobRepository.find({ where: { isActive: true } });
  }
}
