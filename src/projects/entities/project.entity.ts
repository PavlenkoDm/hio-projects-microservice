import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

import { ProjectMember } from './project-member.entity';
import { ProjectLanguage } from './project-language.entity';
import { ProjectStack } from './project-stack.entity';
import {
  DomainType,
  ProjectType,
  ProjectStatus,
  ComplexityType,
} from '../projects-constants/project.constants';

export interface Task {
  taskId: string;
  title: string;
  isCompleted: boolean;
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Index()
  @Column({
    type: 'enum',
    enum: DomainType,
    nullable: false,
  })
  domain: DomainType;

  @Column({
    type: 'enum',
    enum: ProjectType,
    nullable: false,
  })
  type: ProjectType;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.CREATED,
  })
  projectStatus: ProjectStatus;

  @Column({ type: 'text', nullable: true })
  goals?: string;

  // JSON field for teamSize: { "frontend developer": 2, "QA engineer": 1 }
  @Column({
    type: 'jsonb',
    nullable: true,
  })
  teamSize?: Record<string, number>;

  // Fields for ACTIVE status (filling later)
  @Column({
    type: 'enum',
    enum: ComplexityType,
    nullable: true,
  })
  complexity?: ComplexityType;

  @Column({ type: 'integer', nullable: true })
  duration?: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  tasks?: Task[];

  // project dates
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  deadline?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  frozenDate?: Date;

  @OneToMany(() => ProjectMember, (member) => member.project, {
    cascade: true,
    eager: false,
  })
  members: ProjectMember[];

  @OneToMany(() => ProjectLanguage, (language) => language.project, {
    cascade: true,
    eager: false,
  })
  languages: ProjectLanguage[];

  @OneToMany(() => ProjectStack, (stack) => stack.project, {
    cascade: true,
    eager: false,
  })
  stack: ProjectStack[];
}
