import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';

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
import {
  StartProjectDto,
  StartProjectResponseDto,
} from './projects-dto/start-project.dto';
import { addMonths } from '../utils/add-month.utils';
import { UpdateProjectDto } from './projects-dto/update-project.dto';

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
      goals: basics.goals && basics.goals.trim() !== '' ? basics.goals : null,
      domain: basics.domain,
      type: basics.type,
      tasks: basics.tasks && basics.tasks.length !== 0 ? basics.tasks : null,

      complexity:
        publish.complexity && publish.complexity.trim() !== ''
          ? publish.complexity
          : null,
      duration:
        publish.duration && publish.duration !== 0 ? publish.duration : null,

      projectStatus: ProjectStatus.CREATED,

      teamSize: createProjectDto.team.teamSize,
    });

    return await manager.save(Project, project);
  }

  async deleteProjectById(id: number): Promise<ProjectResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const projectToDelete = await this.getProjectWithRelations(id, manager);

        if (!projectToDelete) {
          throw createRpcException(
            HttpStatus.NOT_FOUND,
            `Project with id: ${id} not found`,
          );
        }

        const projectResponse = this.formatProjectResponse(projectToDelete);

        await manager.delete(Project, { id });

        return projectResponse;
      } catch (error) {
        throw createRpcException(
          HttpStatus.BAD_REQUEST,
          `Delete project ERROR: ${error.message}`,
        );
      }
    });
  }

  async getProjects(): Promise<ProjectResponseDto[] | []> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        let getProjectsResponse: ProjectResponseDto[] | [];
        const projects = await this.getProjectsWithRelations(manager);
        if (projects.length !== 0) {
          getProjectsResponse = projects.map((project) =>
            this.formatProjectResponse(project),
          );
        } else {
          getProjectsResponse = [];
        }

        return getProjectsResponse;
      } catch (error) {
        throw createRpcException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          `Get projects ERROR: ${error.message}`,
        );
      }
    });
  }

  async getProjectById(id: number): Promise<ProjectResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const project = await this.getProjectWithRelations(id, manager);

        if (!project) {
          throw createRpcException(
            HttpStatus.NOT_FOUND,
            `Project with id ${id} not found`,
          );
        }

        const projectResponse = this.formatProjectResponse(project);

        return projectResponse;
      } catch (error) {
        throw createRpcException(
          HttpStatus.BAD_REQUEST,
          `Get project ERROR: ${error.message}`,
        );
      }
    });
  }

  async startProject(
    id: number,
    startProjectDto: StartProjectDto,
  ): Promise<StartProjectResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const project = await this.getProjectWithRelations(id, manager);
        if (!project) {
          throw createRpcException(
            HttpStatus.NOT_FOUND,
            `Project with id ${id} not found`,
          );
        }

        const startDate = new Date();
        let deadline: Date | null = null;
        if (
          startProjectDto.publish.duration &&
          startProjectDto.publish.duration > 0
        ) {
          deadline = addMonths(startDate, startProjectDto.publish.duration);
        }

        project.name = startProjectDto.basics.name;
        project.description = startProjectDto.basics.description;
        project.goals = startProjectDto.basics.goals || null;
        project.domain = startProjectDto.basics.domain;
        project.type = startProjectDto.basics.type;
        project.tasks = startProjectDto.basics.tasks?.length
          ? startProjectDto.basics.tasks
          : null;

        project.complexity = startProjectDto.publish.complexity || null;
        project.duration = startProjectDto.publish.duration || null;

        project.projectStatus = ProjectStatus.ACTIVE;
        project.startDate = startDate;
        project.deadline = deadline;
        project.teamSize = startProjectDto.team.teamSize;

        await manager.save(Project, project);

        await manager.delete(ProjectStack, { projectId: project.id });
        await manager.delete(ProjectLanguage, {
          projectId: project.id,
        });
        await manager.delete(ProjectMember, { projectId: project.id });

        await this.createProjectStack(
          project.id,
          startProjectDto.basics.stack,
          manager,
        );
        await this.createProjectLanguages(
          project.id,
          startProjectDto.team.language,
          manager,
        );
        await this.createProjectMembers(
          project.id,
          startProjectDto.team.members,
          manager,
        );

        const updatedProject = await this.getProjectWithRelations(
          project.id,
          manager,
        );
        return this.formatStartProjectResponse(updatedProject);
      } catch (error) {
        throw createRpcException(
          HttpStatus.BAD_REQUEST,
          `Start project ERROR: ${error.message}`,
        );
      }
    });
  }

  async updateProjectMembers(
    projectId: number,
    membersFromFrontend: TeamMemberDto[],
  ): Promise<ProjectMember[]> {
    try {
      const existingMembers = await this.projectMemberRepo.find({
        where: { projectId },
      });

      const existingMembersMap = new Map(
        existingMembers.map((m: ProjectMember) => [m.userId, m]),
      );

      const toCreate: Partial<ProjectMember>[] = [];
      const toUpdate: ProjectMember[] = [];

      for (const frontendMember of membersFromFrontend) {
        const existing = existingMembersMap.get(frontendMember.userId);

        if (!existing) {
          toCreate.push({
            projectId,
            ...frontendMember,
          });
        } else if (this.hasChangesInMembers(existing, frontendMember)) {
          Object.assign(existing, frontendMember);
          toUpdate.push(existing);
        }
      }

      return await this.dataSource.transaction(async (manager) => {
        if (toCreate.length > 0) {
          await manager
            .createQueryBuilder()
            .insert()
            .into(ProjectMember)
            .values(toCreate)
            .execute();
        }

        if (toUpdate.length > 0) {
          await manager.save(ProjectMember, toUpdate);
        }

        return await manager.find(ProjectMember, {
          where: { projectId },
        });
      });
    } catch (error) {
      throw createRpcException(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Update project members ERROR: ${error.message}`,
      );
    }
  }

  async updateProject(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return await this.dataSource.transaction(async (manager) => {
      try {
        const project = await this.getProjectWithRelations(id, manager);

        if (!project) {
          throw createRpcException(
            HttpStatus.NOT_FOUND,
            `Project with id: ${id} not found`,
          );
        }

        // Update BASICS section
        if (updateProjectDto.basics) {
          const { stack, tasks, name, description, goals, domain, type } =
            updateProjectDto.basics;

          if (name !== undefined) project.name = name;
          if (description !== undefined) project.description = description;
          if (goals !== undefined) {
            project.goals = goals && goals.trim() !== '' ? goals : null;
          }
          if (domain !== undefined) project.domain = domain;
          if (type !== undefined) project.type = type;

          if (stack !== undefined) {
            await this.updateProjectStack(project.id, stack, manager);
          }

          if (tasks !== undefined) {
            project.tasks = tasks && tasks.length > 0 ? tasks : null;
          }
        }

        // Update TEAM section
        if (updateProjectDto.team) {
          const { language, teamSize } = updateProjectDto.team;

          if (language !== undefined) {
            await this.updateProjectLanguages(project.id, language, manager);
          }

          // Update TEAM SIZE (JSONB - full replace)
          if (teamSize !== undefined) {
            project.teamSize = teamSize;
          }
        }

        // Update PUBLISH section
        if (updateProjectDto.publish) {
          if (updateProjectDto.publish.complexity !== undefined) {
            project.complexity =
              updateProjectDto.publish.complexity &&
              updateProjectDto.publish.complexity.trim() !== ''
                ? updateProjectDto.publish.complexity
                : null;
          }
          if (updateProjectDto.publish.duration !== undefined) {
            project.duration =
              updateProjectDto.publish.duration &&
              updateProjectDto.publish.duration !== 0
                ? updateProjectDto.publish.duration
                : null;
          }
        }

        await manager.save(Project, project);

        const updatedProject = await this.getProjectWithRelations(
          project.id,
          manager,
        );

        return this.formatProjectResponse(updatedProject);
      } catch (error) {
        throw createRpcException(
          HttpStatus.BAD_REQUEST,
          `Update project ERROR: ${error.message}`,
        );
      }
    });
  }

  //==========================================================================

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
        status: member.status,
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

  private async getProjectsWithRelations(
    manager: EntityManager,
  ): Promise<Project[] | []> {
    return await manager.find(Project, {
      relations: ['members', 'languages', 'stack'],
    });
  }

  private formatProjectResponse(project: Project): ProjectResponseDto {
    const { complexity, duration } = project;
    const publish = !complexity || !duration ? {} : { complexity, duration };

    return {
      basics: {
        id: project.id,
        name: project.name,
        description: project.description,
        goals: !project.goals ? '' : project.goals,
        domain: project.domain,
        stack: !project.stack ? [] : project.stack.map((s) => s.stackItem),
        type: project.type,
        tasks: !project.tasks ? [] : project.tasks,
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
            status: member.status,
          })) || [],
      },
      publish,
      projectStatus: project.projectStatus,
      createdAt: project.createdAt.toISOString(),
      startDate: project.startDate?.toISOString() || null,
      deadline: project.deadline?.toISOString() || null,
      frozenDate: project.frozenDate?.toISOString() || null,
    };
  }

  private formatStartProjectResponse(
    project: Project,
  ): StartProjectResponseDto {
    const { complexity, duration } = project;
    const publish = { complexity, duration };

    return {
      basics: {
        id: project.id,
        name: project.name,
        description: project.description,
        goals: project.goals,
        domain: project.domain,
        stack: project.stack.map((s) => s.stackItem),
        type: project.type,
        tasks: project.tasks,
      },
      team: {
        language: project.languages.map((lang) => ({
          code: lang.languageCode,
          label: lang.languageLabel,
        })),
        teamSize: project.teamSize,
        members: project.members.map((member) => ({
          userId: member.userId,
          name: member.name,
          avatarUrl: member.avatarUrl,
          mentorship: member.mentorship,
          role: member.role,
          directions: member.directions,
          status: member.status,
        })),
      },
      publish,
      projectStatus: project.projectStatus,
      createdAt: project.createdAt.toISOString(),
      startDate: project.startDate?.toISOString() || null,
      deadline: project.deadline?.toISOString() || null,
      frozenDate: project.frozenDate?.toISOString() || null,
    };
  }

  private hasChangesInMembers(
    existing: ProjectMember,
    updated: TeamMemberDto,
  ): boolean {
    return (
      existing.name !== updated.name ||
      existing.avatarUrl !== updated.avatarUrl ||
      existing.mentorship !== updated.mentorship ||
      existing.role !== updated.role ||
      existing.status !== updated.status ||
      JSON.stringify(existing.directions) !== JSON.stringify(updated.directions)
    );
  }

  private async updateProjectStack(
    projectId: number,
    newStack: string[],
    manager: EntityManager,
  ): Promise<void> {
    const currentStack = await manager.find(ProjectStack, {
      where: { projectId },
    });

    const currentStackItems = currentStack.map((s) => s.stackItem);

    const newStackSet = new Set(newStack);
    const currentStackSet = new Set(currentStackItems);

    const itemsToDelete = currentStackItems.filter(
      (item) => !newStackSet.has(item),
    );

    const itemsToAdd = newStack.filter((item) => !currentStackSet.has(item));

    if (itemsToDelete.length > 0) {
      await manager.delete(ProjectStack, {
        projectId,
        stackItem: In(itemsToDelete),
      });
    }

    if (itemsToAdd.length > 0) {
      await this.createProjectStack(projectId, itemsToAdd, manager);
    }
  }

  private async updateProjectLanguages(
    projectId: number,
    newLanguages: LanguageDto[],
    manager: EntityManager,
  ): Promise<void> {
    const currentLanguages = await manager.find(ProjectLanguage, {
      where: { projectId },
    });

    const currentCodes = currentLanguages.map((l) => l.languageCode);
    const newCodes = newLanguages.map((l) => l.code);

    const currentCodesSet = new Set(currentCodes);
    const newCodesSet = new Set(newCodes);

    const codesToDelete = currentCodes.filter((code) => !newCodesSet.has(code));

    const languagesToAdd = newLanguages.filter(
      (lang) => !currentCodesSet.has(lang.code),
    );

    if (codesToDelete.length > 0) {
      await manager.delete(ProjectLanguage, {
        projectId,
        languageCode: In(codesToDelete),
      });
    }

    if (languagesToAdd.length > 0) {
      await this.createProjectLanguages(projectId, languagesToAdd, manager);
    }
  }
}
