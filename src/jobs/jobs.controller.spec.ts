import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Job } from './job.entity';

describe('JobsController', () => {
  let controller: JobsController;
  let service: JobsService;

  const mockJobs: Job[] = [
    {
      id: 1,
      title: 'Frontend Developer',
      description: 'React, Vue, Angular',
      company: 'Tech Corp',
      isActive: true,
    } as Job,
    {
      id: 2,
      title: 'Data Engineer',
      description: 'AWS and GCP',
      company: 'Cloud Inc',
      isActive: true,
    } as Job,
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [
        {
          provide: JobsService,
          useValue: {
            create: jest.fn(),
            search: jest.fn(),
            findActiveJobs: jest.fn(),
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

  describe('create', () => {
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
      } as Job;

      jest.spyOn(service, 'create').mockResolvedValue(createdJob);

      const result = await controller.create(jobData);

      expect(result).toEqual(createdJob);
      expect(service.create).toHaveBeenCalledWith(jobData);
    });

    it('should throw an error when create fails', async () => {
      jest.spyOn(service, 'create').mockRejectedValue(new Error('Create failed'));

      await expect(controller.create({})).rejects.toThrow('Create failed');
    });
  });

  describe('search', () => {
    it('should return search results', async () => {
      jest.spyOn(service, 'search').mockResolvedValue([mockJobs[0]]);

      const result = await controller.search('Frontend');

      expect(result).toEqual([mockJobs[0]]);
      expect(service.search).toHaveBeenCalledWith('Frontend');
    });

    it('should throw an error when search fails', async () => {
      jest.spyOn(service, 'search').mockRejectedValue(new Error('Search failed'));

      await expect(controller.search('Frontend')).rejects.toThrow('Search failed');
    });
  });

  describe('findActiveJobs', () => {
    it('should return all active jobs', async () => {
      jest.spyOn(service, 'findActiveJobs').mockResolvedValue(mockJobs);

      const result = await controller.findActiveJobs();

      expect(result).toEqual(mockJobs);
      expect(service.findActiveJobs).toHaveBeenCalled();
    });

    it('should return an empty array when no active jobs', async () => {
      jest.spyOn(service, 'findActiveJobs').mockResolvedValue([]);

      const result = await controller.findActiveJobs();

      expect(result).toEqual([]);
    });

    it('should throw an error when findActiveJobs fails', async () => {
      jest.spyOn(service, 'findActiveJobs').mockRejectedValue(new Error('Failed to fetch active jobs'));

      await expect(controller.findActiveJobs()).rejects.toThrow('Failed to fetch active jobs');
    });
  });
});
