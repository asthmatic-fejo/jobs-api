import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from '../src/jobs/job.entity';

describe('JobsController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Job>;

  const mockJobs = [
    { id: 1, title: 'Frontend Developer', description: 'React, Vue', company: 'Tech Corp', isActive: true },
    { id: 2, title: 'Backend Developer', description: 'Node.js', company: 'Tech Corp', isActive: true },
    { id: 3, title: 'DevOps Engineer', description: 'AWS, CI/CD', company: 'Tech Corp', isActive: false },
  ];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<Job>>(getRepositoryToken(Job));

    // Seed test data
    await repository.save(mockJobs);
  });

  afterAll(async () => {
    await repository.query('DELETE FROM job;'); // Clean up DB
    await app.close();
  });

  it('/jobs (POST) should create a job', async () => {
    const newJob = {
      title: 'Data Engineer',
      description: 'Big Data pipelines',
      company: 'Tech Corp',
      isActive: true,
    };

    const response = await request(app.getHttpServer())
      .post('/jobs')
      .send(newJob)
      .expect(201);

    expect(response.body.title).toBe(newJob.title);
    expect(response.body.isActive).toBe(true);
    expect(response.body.id).toBeDefined();
  });

  it('/jobs?q=Developer (GET) should return matching active jobs', async () => {
    const response = await request(app.getHttpServer())
      .get('/jobs?q=Developer')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach((job) => {
      expect(job.isActive).toBe(true);
      expect(
        job.title.includes('Developer') || job.description.includes('Developer'),
      ).toBeTruthy();
    });
  });

  it('/jobs/active (GET) should return all active jobs', async () => {
    const response = await request(app.getHttpServer())
      .get('/jobs/active')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    response.body.forEach((job) => {
      expect(job.isActive).toBe(true);
    });
  });

  it('/jobs?q=NonExisting (GET) should return empty array', async () => {
    const response = await request(app.getHttpServer())
      .get('/jobs?q=NonExisting')
      .expect(200);

    expect(response.body).toEqual([]);
  });
});
