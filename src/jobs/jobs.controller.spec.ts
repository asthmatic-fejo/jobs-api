import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Job } from './job.entity';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            create: jest.fn(), // Mocks vacíos
          },
        },
      ],
    }).compile();

    controller = module.get<JobsController>(JobsController);
    service = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a job', async () => {
    const jobData: Partial<Job> = {
      title: 'Backend Developer',
      description: 'Develop APIs',
      company: 'Tech Corp',
      isActive: true,
    };

    const createdJob = {
      id: 1,
      ...jobData,
    };

    jest.spyOn(service, 'create').mockResolvedValue(createdJob as Job);

    const result = await controller.create(jobData);

    expect(result).toEqual(createdJob);
    expect(service.create).toHaveBeenCalledWith(jobData);
  });
});
