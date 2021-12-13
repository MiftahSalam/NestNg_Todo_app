import { IsNotEmpty, IsUUID } from 'class-validator'
import { UserDto } from 'src/user/dtos/user.dto'
import { TaskDto } from './task.dto'

export class TodoDto {
  @IsNotEmpty()
  @IsUUID()
  id: string

  @IsNotEmpty()
  name: string

  createdOn?: Date
  description?: string
  tasks?: TaskDto[]
  owner?: UserDto
}
