import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Project } from './project.entity';
import {
  TeamRole,
  UserStatus,
  WorkDirection,
} from '../projects-constants/project.constants';

@Entity('project_members')
export class ProjectMember {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Index()
  @Column({ type: 'bigint', name: 'project_id' })
  projectId: number;
  @ManyToOne(() => Project, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ type: 'varchar', length: 255, nullable: false })
  userId: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'boolean', nullable: true, default: false })
  mentorship?: boolean;

  @Column({
    type: 'enum',
    enum: TeamRole,
    nullable: false,
    default: TeamRole.USER,
  })
  role: TeamRole;

  @Column({
    type: 'jsonb',
    nullable: false,
  })
  directions: WorkDirection[];

  @Column({
    type: 'enum',
    enum: UserStatus,
    nullable: false,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
