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
  //IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

import {
  ComplexityType,
  DomainType,
  //ProjectStatus,
  ProjectType,
  // TeamRole,
  // UserStatus,
  // WorkDirection,
} from '../projects-constants/project.constants';

// >>> Nested DTO
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

// export class TeamMemberDto {
//   @IsString()
//   @IsNotEmpty()
//   userId: string;

//   @IsString()
//   @IsNotEmpty()
//   name: string;

//   @IsOptional()
//   @IsString()
//   avatarUrl?: string;

//   //@IsOptional()
//   @IsBoolean()
//   mentorship: boolean = false;

//   @IsEnum(TeamRole)
//   role: TeamRole;

//   @IsArray()
//   @IsEnum(WorkDirection, { each: true })
//   directions: WorkDirection[];

//   @IsEnum(UserStatus)
//   status: UserStatus;
// }

// >>> BASIC SECTION
export class BasicsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  goals?: string;

  @IsOptional()
  @IsEnum(DomainType)
  domain?: DomainType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  stack?: string[];

  @IsOptional()
  @IsEnum(ProjectType)
  type?: ProjectType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskDto)
  tasks?: TaskDto[];
}

// >>> TEAM SECTION
export class TeamDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageDto)
  language?: LanguageDto[];

  @IsOptional()
  @IsObject()
  teamSize?: Record<string, number>;

  // @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  // @Type(() => TeamMemberDto)
  // members?: TeamMemberDto[];
}

// >>> PUBLISH SECTION
export class PublishDto {
  @IsOptional()
  @IsEnum(ComplexityType)
  complexity?: ComplexityType;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(24)
  duration?: number;
}

// >>> MAIN DTO
export class UpdateProjectDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => BasicsDto)
  basics?: BasicsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => TeamDto)
  team?: TeamDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => PublishDto)
  publish?: PublishDto;
}
