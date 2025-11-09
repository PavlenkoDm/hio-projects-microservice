import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { ProjectsService } from './projects.service';
import { ProjectsQueueEvents } from '../queue/constants/queue.constants';
import {
  CreateProjectDto,
  TeamMemberDto,
} from './projects-dto/create-project.dto';
import { StartProjectDto } from './projects-dto/start-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @MessagePattern({ cmd: ProjectsQueueEvents.CREATE_PROJECT })
  async create(@Payload() createProjectDto: CreateProjectDto) {
    return await this.projectsService.createProject(createProjectDto);
  }

  @MessagePattern({ cmd: ProjectsQueueEvents.DELETE_PROJECT_BY_ID })
  async deleteById(@Payload() projectId: { id: number }) {
    const { id } = projectId;
    return await this.projectsService.deleteProjectById(id);
  }

  @MessagePattern({ cmd: ProjectsQueueEvents.GET_PROJECT_BY_ID })
  async getById(@Payload() projectId: { id: number }) {
    const { id } = projectId;
    return await this.projectsService.getProjectById(id);
  }

  @MessagePattern({ cmd: ProjectsQueueEvents.START_PROJECT })
  async start(
    @Payload()
    startPayload: {
      id: number;
      startProjectDto: StartProjectDto;
    },
  ) {
    const { id, startProjectDto } = startPayload;
    return await this.projectsService.startProject(id, startProjectDto);
  }

  @MessagePattern({ cmd: ProjectsQueueEvents.UPDATE_PROJECT_MEMBERS })
  async updateProjectTeamMembers(
    @Payload()
    updateMembersPayload: {
      projectId: number;
      teamMembers: TeamMemberDto[];
    },
  ) {
    const { projectId, teamMembers } = updateMembersPayload;
    return await this.projectsService.updateProjectMembers(
      projectId,
      teamMembers,
    );
  }
}
