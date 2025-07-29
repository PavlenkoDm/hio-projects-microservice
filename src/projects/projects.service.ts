import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './entities/project.entity';
import { Participant } from './entities/participant.entity';
import { CreateProjectDto } from './projects-dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Participant)
    private participantsRepository: Repository<Participant>,
  ) {}

  async createProject(createProjectDto: CreateProjectDto) {
    const newProject = this.projectsRepository.create(createProjectDto);
    return await this.projectsRepository.save(newProject);
  }
}
