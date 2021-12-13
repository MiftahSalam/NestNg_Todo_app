import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator'

export class TodoCreateDto {
  @IsNotEmpty()
  name: string

  @MaxLength(500)
  @IsOptional()
  description?: string
}
