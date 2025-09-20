import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';

import { Project } from './project.entity';

@Entity('project_languages')
@Unique(['projectId', 'languageCode'])
export class ProjectLanguage {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'bigint', name: 'project_id' })
  projectId: number;
  @ManyToOne(() => Project, (project) => project.languages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'varchar', length: 10, nullable: false })
  languageCode: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  languageLabel: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
