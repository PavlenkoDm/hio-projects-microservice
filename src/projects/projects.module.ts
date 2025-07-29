import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';

import { Participant } from './entities/participant.entity';
import { Project } from './entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Participant, Project])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
