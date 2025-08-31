import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { Project } from './entities/project.entity';
import {
  CreateProjectDto,
  LanguageDto,
  ProjectResponseDto,
  TeamMemberDto,
} from './projects-dto/create-project.dto';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectLanguage } from './entities/project-language.entity';
import { ProjectStack } from './entities/project-stack.entity';
import { ProjectStatus } from './projects-constants/project.constants';
import { createRpcException } from '../utils/create-rpcexception.utils';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(ProjectMember)
    private readonly projectMemberRepo: Repository<ProjectMember>,

    @InjectRepository(ProjectLanguage)
    private readonly projectLangugeRepo: Repository<ProjectLanguage>,

    @InjectRepository(ProjectStack)
    private readonly projectStackRepo: Repository<ProjectStack>,

    private readonly dataSource: DataSource,
  ) {}

  async createProject(
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const project = await this.createMainProject(createProjectDto, manager);

        await this.createProjectLanguages(
          project.id,
          createProjectDto.team.language,
          manager,
        );
        await this.createProjectStack(
          project.id,
          createProjectDto.basics.stack,
          manager,
        );
        await this.createProjectMembers(
          project.id,
          createProjectDto.team.members,
          manager,
        );

        const createdProject = await this.getProjectWithRelations(
          project.id,
          manager,
        );

        return this.formatProjectResponse(createdProject);
      } catch (error) {
        throw createRpcException(
          HttpStatus.BAD_REQUEST,
          `Creation project ERROR: ${error.message}`,
        );
      }
    });
  }

  async createMainProject(
    createProjectDto: CreateProjectDto,
    manager: EntityManager,
  ): Promise<Project> {
    const { basics, publish } = createProjectDto;

    const project = manager.create(Project, {
      name: basics.name,
      description: basics.description,
      goals: basics.goals || null,
      domain: basics.domain,
      domainSlug: basics.domainSlug,
      type: basics.type,
      tasks: basics.tasks || null,

      complexity: publish.complexity || null,
      duration: publish.duration || null,

      projectStatus: ProjectStatus.CREATED,

      teamSize: createProjectDto.team.teamSize,
    });

    return await manager.save(Project, project);
  }

  private async createProjectLanguages(
    projectId: number,
    languages: LanguageDto[],
    manager: EntityManager,
  ): Promise<void> {
    if (!languages || languages.length === 0) return;

    const projectLanguages = languages.map((lang) =>
      manager.create(ProjectLanguage, {
        projectId,
        languageCode: lang.code,
        languageLabel: lang.label,
      }),
    );

    await manager.save(ProjectLanguage, projectLanguages);
  }

  private async createProjectStack(
    projectId: number,
    stack: string[] | undefined,
    manager: EntityManager,
  ): Promise<void> {
    if (!stack || stack.length === 0) return;

    const projectStack = stack.map((stackItem) =>
      manager.create(ProjectStack, {
        projectId,
        stackItem,
      }),
    );

    await manager.save(ProjectStack, projectStack);
  }

  private async createProjectMembers(
    projectId: number,
    members: TeamMemberDto[] | undefined,
    manager: EntityManager,
  ): Promise<void> {
    if (!members || members.length === 0) return;

    const projectMembers = members.map((member) =>
      manager.create(ProjectMember, {
        projectId,
        userId: member.userId,
        name: member.name,
        avatarUrl: member.avatarUrl,
        mentorship: member.mentorship || false,
        role: member.role,
        directions: member.directions,
      }),
    );

    await manager.save(ProjectMember, projectMembers);
  }

  private async getProjectWithRelations(
    projectId: number,
    manager: EntityManager,
  ): Promise<Project> {
    return await manager.findOne(Project, {
      where: { id: projectId },
      relations: ['members', 'languages', 'stack'],
    });
  }

  private formatProjectResponse(project: Project): ProjectResponseDto {
    return {
      basics: {
        id: project.id,
        name: project.name,
        description: project.description,
        goals: project.goals || null,
        domain: project.domain,
        domainSlug: project.domainSlug,
        stack: project.stack?.map((s) => s.stackItem) || null,
        type: project.type,
        tasks: project.tasks || null,
      },
      team: {
        language:
          project.languages?.map((lang) => ({
            code: lang.languageCode,
            label: lang.languageLabel,
          })) || [],
        teamSize: project.teamSize || {},
        members:
          project.members?.map((member) => ({
            userId: member.userId,
            name: member.name,
            avatarUrl: member.avatarUrl,
            mentorship: member.mentorship,
            role: member.role,
            directions: member.directions,
          })) || [],
      },
      publish: {
        complexity: project.complexity || null,
        duration: project.duration || null,
      },
      projectStatus: project.projectStatus,
      createdAt: project.createdAt.toISOString(),
      startDate: project.startDate?.toISOString() || null,
      deadline: project.deadline?.toISOString() || null,
      frozenDate: project.frozenDate?.toISOString() || null,
    };
  }
}
