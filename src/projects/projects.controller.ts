import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProjectsService } from './projects.service';
import { ProjectsQueueEvents } from '../queue/constants/queue.constants';
import { CreateProjectDto } from './projects-dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @MessagePattern({ cmd: ProjectsQueueEvents.CREATE_PROJECT })
  async create(@Payload() createProjectDto: CreateProjectDto) {
    return await this.projectsService.createProject(createProjectDto);
  }
}
