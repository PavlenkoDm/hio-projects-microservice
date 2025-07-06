import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './entities/project.entity';
import { Participant } from './entities/participant.entitiy';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private userRepository: Repository<Project>,
    @InjectRepository(Participant)
    private participantsRepository: Repository<Participant>,
  ) {}
}
