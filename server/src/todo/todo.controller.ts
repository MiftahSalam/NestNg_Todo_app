import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { from, map, Observable, switchMap } from 'rxjs'
import { UserDto } from 'src/user/dtos/user.dto'
import { DeleteResult, UpdateResult } from 'typeorm'
import { TodoCreateDto } from './dtos/todo-create.dto'
import { TodoListDtos } from './dtos/todo-list.dto'
import { TodoDto } from './dtos/todo.dto'
import { TodoService } from './todo.service'

@Controller('api/todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  findAll(): Observable<TodoListDtos> {
    return this.todoService.getAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Observable<TodoDto> {
    return this.todoService.getOneTodo(id)
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  create(@Body() todo: TodoCreateDto, @Req() req: any): Observable<TodoDto> {
    const user = req.user as Observable<UserDto>
    return from(user).pipe(
      switchMap((curUser: UserDto) => {
        console.log('create user req', curUser)
        return this.todoService.createTodo(curUser, todo)
      }),
    )
    // user.subscribe((user: UserDto) => console.log('create user req', user))
    // return this.todoService.createTodo(req.user, todo)
  }

  // @Put(':id')
  // @UsePipes(new ValidationPipe())
  // update(@Param('id') id: string, @Body() todo: TodoDto): Observable<TodoDto> {
  //   return this.todoService.updateTodo(id, todo)
  // }
  @Put()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  update(@Body() todo: TodoDto): Observable<UpdateResult> {
    return this.todoService.updateTodo(todo)
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  deleteTodo(
    @Param('id') id: string,
    @Req() req: any,
  ): Observable<DeleteResult> {
    const user = req.user as Observable<UserDto>
    return from(user).pipe(
      switchMap((curUser: UserDto) => {
        Logger.log('delete todo', 'TodoController-deleteTodo')
        return this.todoService.deleteTodo(id, curUser)
      }),
    )

    // return this.todoService.deleteTodo(id)
  }
}
