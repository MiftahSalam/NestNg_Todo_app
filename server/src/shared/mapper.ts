import { TodoDto } from 'src/todo/dtos/todo.dto'
import { TodoEntity } from '@todo/entities/todo.entity'
import { Logger } from '@nestjs/common'
import { TaskEntity } from '@todo/entities/task.entity'
import { TaskDto } from '@todo/dtos/task.dto'
import { UserEntity } from 'src/user/entities/user.entity'
import { UserDto } from 'src/user/dtos/user.dto'

export const toTodoDto = (data: TodoEntity): TodoDto => {
  const { id, name, description, tasks, owner } = data
  let todoDto: TodoDto = {
    id,
    name,
    description,
    owner: owner ? toUserDto(owner) : null,
  }

  if (tasks) {
    todoDto = {
      ...todoDto,
      tasks: tasks.map((taks: TaskEntity) => toTaskDto(taks)),
    }
  }
  return todoDto
}

export const toTaskDto = (data: TaskEntity) => {
  const { id, name } = data
  let taskDto: TaskDto = { id, name }

  return taskDto
}

export const toUserDto = (data: UserEntity) => {
  const { id, username, email } = data
  let userDto: UserDto = { id, email, username }

  return userDto
}
