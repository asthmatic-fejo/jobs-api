import { Test, TestingModule } from '@nestjs/testing';
import { JobsService } from './jobs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { Like } from 'typeorm';

describe('JobsService', () => {
  let service: JobsService;
  let repository: Repository<Job>;

  const mockJobs = [
    {
      id: 1,
      title: 'Frontend Developer',
      description: 'React, Vue, Angular',
      isActive: true,
    },
    {
      id: 2,
      title: 'Data Engineer',
      description: 'AWS and GCP',
      isActive: true,
    },
    {
      id: 3,
      title: 'Backend Developer',
      description: 'Node.js with MongoDB',
      isActive: false,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        {
          provide: getRepositoryToken(Job),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    repository = module.get<Repository<Job>>(getRepositoryToken(Job));
  });

  describe('create', () => {
    it('should create and save a job', async () => {
      const jobData: Partial<Job> = {
        title: 'Frontend Developer',
        description: 'Build UI',
        company: 'Tech Corp',
        isActive: true,
      };

      const createdJob = {
        id: 1,
        ...jobData,
      } as Job;

      jest.spyOn(repository, 'create').mockReturnValue(createdJob);
      jest.spyOn(repository, 'save').mockResolvedValue(createdJob);

      const result = await service.create(jobData);

      expect(repository.create).toHaveBeenCalledWith(jobData);
      expect(repository.save).toHaveBeenCalledWith(createdJob);
      expect(result).toEqual(createdJob);
    });

    it('should throw an error if job creation fails', async () => {
      const jobData: Job = {
        id: 1,
        title: 'Frontend Developer',
        description: 'Build UI',
        company: 'Tech Corp',
        isActive: true,
      };

      jest.spyOn(repository, 'create').mockReturnValue(jobData);
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Failed to save job'));

      try {
        await service.create(jobData);
      } catch (error) {
        expect(error.message).toBe('Failed to save job');
      }
    });
  });

  describe('search', () => {
    it('should find an active job matching "dev" search', async () => {
      (repository.find as jest.Mock).mockResolvedValue([
        mockJobs[0],
      ]);

      const result = await service.search('dev');

      expect(repository.find).toHaveBeenCalledWith({
        where: [
          { title: Like(`%dev%`), isActive: true },
          { description: Like(`%dev%`), isActive: true },
        ],
      });

      expect(result).toHaveLength(1);
      expect(result[0].title).toContain('Developer');
      expect(result[0].isActive).toBe(true);
    });

    it('should return an empty array due mismatch search (bigdata)', async () => {
      (repository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.search('bigdata');

      expect(repository.find).toHaveBeenCalledWith({
        where: [
          { title: Like(`%bigdata%`), isActive: true },
          { description: Like(`%bigdata%`), isActive: true },
        ],
      });

      expect(result).toHaveLength(0);
    });

    it('should throw an error if search fails', async () => {
      const errorMessage = 'Database query failed';
      jest.spyOn(repository, 'find').mockRejectedValue(new Error(errorMessage));

      try {
        await service.search('dev');
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });

  describe('findActiveJobs', () => {
    it('should return all active jobs', async () => {
      const activeJobs = [
        {
          id: 1,
          title: 'Frontend Developer',
          description: 'React, Vue, Angular',
          isActive: true,
        },
        {
          id: 2,
          title: 'Data Engineer',
          description: 'AWS and GCP',
          isActive: true,
        },
      ] as Job[];

      (repository.find as jest.Mock).mockResolvedValue(activeJobs);

      const result = await service.findActiveJobs();

      expect(repository.find).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result).toEqual(activeJobs);
    });

    it('should return an empty array when no active jobs', async () => {
      (repository.find as jest.Mock).mockResolvedValue([]);

      const result = await service.findActiveJobs();

      expect(repository.find).toHaveBeenCalledWith({
        where: { isActive: true },
      });
      expect(result).toEqual([]);
    });

    it('should throw an error when repository fails', async () => {
      (repository.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(service.findActiveJobs()).rejects.toThrow('Database error');
    });
  });

});
