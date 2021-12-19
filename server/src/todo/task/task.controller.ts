import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { CreateTaskDto } from '@todo/dtos/task-create.dto'
import { TaskDto } from '@todo/dtos/task.dto'
import { from, Observable, switchMap } from 'rxjs'
import { UserDto } from '../../user/dtos/user.dto'
import { DeleteResult } from 'typeorm'
import { TaskService } from './task.service'

@Controller('api/task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOneTask(@Req() req: any, @Param('id') id: string): Observable<TaskDto> {
    const user = req.user as Observable<UserDto>
    return from(user).pipe(
      switchMap((curUser: UserDto) => {
        console.log('TaskController-findOne user', curUser)
        return this.taskService.getTask(id, curUser)
      }),
    )
    // return this.taskService.getTask(id)
  }

  @Get('todo/:id')
  @UseGuards(AuthGuard('jwt'))
  findTaskByTodo(
    @Req() req: any,
    @Param('id') todoId: string,
  ): Observable<TaskDto[]> {
    const user = req.user as Observable<UserDto>
    return from(user).pipe(
      switchMap((curUser: UserDto) => {
        console.log('TaskController-findOne user', curUser)
        return this.taskService.getTaskByTodo(todoId, curUser)
        // return this.taskService.getTask(id, curUser)
      }),
    )
    // return this.taskService.getTaskByTodo(todoId)
  }

  @Post('todo/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  create(
    @Param('id') todoId: string,
    @Req() req: any,
    @Body() createTaskDto: CreateTaskDto,
  ): Observable<TaskDto> {
    const user = req.user as Observable<UserDto>
    return from(user).pipe(
      switchMap((curUser: UserDto) => {
        console.log('create task user req', curUser)
        return this.taskService.createTask(todoId, curUser, createTaskDto)
      }),
    )
    // return this.taskService.createTask(todoId, createTaskDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  deleteTask(
    @Param('id') id: string,
    @Req() req: any,
  ): Observable<DeleteResult> {
    const user = req.user as Observable<UserDto>
    return from(user).pipe(
      switchMap((curUser: UserDto) => {
        Logger.log('delete task', 'TaskController-deleteTask')
        return this.taskService.deleteTask(id, curUser)
      }),
    )

    // return this.taskService.deleteTask(id)
  }
}
