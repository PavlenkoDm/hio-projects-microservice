import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsBoolean,
  IsInt,
  IsObject,
  ValidateNested,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  ComplexityType,
  DomainType,
  ProjectStatus,
  ProjectType,
  TeamRole,
  UserStatus,
  WorkDirection,
} from '../projects-constants/project.constants';

// Nested DTO
export class TaskDto {
  @IsString()
  @IsNotEmpty()
  taskId: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsBoolean()
  isCompleted: boolean = false;
}

export class LanguageDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  label: string;
}

export class TeamMemberDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsBoolean()
  mentorship: boolean = false;

  @IsEnum(TeamRole)
  role: TeamRole;

  @IsArray()
  @IsEnum(WorkDirection, { each: true })
  directions: WorkDirection[];

  @IsEnum(UserStatus)
  status: UserStatus;
}

// basics section
export class BasicsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description: string;

  @IsString()
  @MaxLength(1000)
  goals: string;

  @IsEnum(DomainType)
  domain: DomainType;

  @IsArray()
  @IsString({ each: true })
  stack: string[];

  @IsEnum(ProjectType)
  type: ProjectType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];
}

// team section
export class TeamDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  language: LanguageDto[];

  @IsObject()
  teamSize: Record<string, number>;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TeamMemberDto)
  members: TeamMemberDto[];
}

// publish section
export class PublishDto {
  @IsEnum(ComplexityType)
  complexity: ComplexityType;

  @IsInt()
  @Min(0)
  @Max(24)
  duration?: number;
}

// Main DTO
export class CreateProjectDto {
  @ValidateNested()
  @Type(() => BasicsDto)
  basics: BasicsDto;

  @ValidateNested()
  @Type(() => TeamDto)
  team: TeamDto;

  @ValidateNested()
  @Type(() => PublishDto)
  publish: PublishDto;
}

//==============================================================================

//Response
export class BasicsResponseDto {
  @IsInt()
  @Min(1)
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @MinLength(0)
  @IsString()
  goals: string;

  @IsEnum(DomainType)
  domain: DomainType;

  @IsArray()
  @IsString({ each: true })
  stack: string[];

  @IsEnum(ProjectType)
  type: ProjectType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks: TaskDto[];
}

export class PublishResponseDto {
  @IsOptional()
  @IsEnum(ComplexityType)
  complexity?: ComplexityType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24)
  duration?: number;
}

export class ProjectResponseDto {
  @ValidateNested()
  @Type(() => BasicsResponseDto)
  basics: BasicsResponseDto;

  @ValidateNested()
  @Type(() => TeamDto)
  team: TeamDto;

  @ValidateNested()
  @Type(() => PublishResponseDto)
  publish: PublishResponseDto;

  @IsEnum(ProjectStatus)
  projectStatus: ProjectStatus;

  @IsDateString()
  createdAt: string;

  @IsOptional()
  @IsDateString()
  startDate?: string | null;

  @IsOptional()
  @IsDateString()
  deadline?: string | null;

  @IsOptional()
  @IsDateString()
  frozenDate?: string | null;
}
