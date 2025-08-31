import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { ProjectLanguage } from './entities/project-language.entity';
import { ProjectStack } from './entities/project-stack.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      ProjectMember,
      ProjectLanguage,
      ProjectStack,
    ]),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
