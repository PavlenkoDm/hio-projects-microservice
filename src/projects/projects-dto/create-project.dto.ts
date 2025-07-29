import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(200)
  description: string;
}

export class CreateProjectResponseDto {
  status: number;

  message: string;
}
