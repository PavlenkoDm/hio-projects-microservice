import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';

import { Project } from './project.entity';

@Entity('project_stack')
@Unique(['projectId', 'stackItem'])
export class ProjectStack {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', name: 'project_id' })
  projectId: number;
  @ManyToOne(() => Project, (project) => project.stack, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project; //Можем получить объект project

  @Column({ type: 'varchar', length: 100, nullable: false })
  stackItem: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
