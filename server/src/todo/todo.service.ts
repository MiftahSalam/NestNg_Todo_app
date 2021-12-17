import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import {
  catchError,
  find,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs'
// import { v4 as uuidv4 } from 'uuid'

import { todos } from 'src/mock/todos.mock'
import { TodoCreateDto } from './dtos/todo-create.dto'
import { TodoDto } from './dtos/todo.dto'
import { TodoEntity } from '@todo/entities/todo.entity'
import { toTodoDto } from 'src/shared/mapper'
import { TodoListDtos } from './dtos/todo-list.dto'
import { UserService } from 'src/user/services/user/user.service'
import { UserDto } from 'src/user/dtos/user.dto'
import { UserEntity } from 'src/user/entities/user.entity'

@Injectable()
export class TodoService {
  todos: TodoEntity[] = todos

  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    private readonly userService: UserService,
  ) {}

  getAll({ username }: UserDto): Observable<TodoListDtos> {
    // let listTodo: TodoDto[] = this.todos.map((todo: TodoEntity) =>
    //   toTodoDto(todo),
    // )
    // const todoList: TodoListDtos = {
    //   todos: listTodo,
    // }

    // return of(todoList)
    return from(
      this.todoRepository.find({
        relations: ['tasks', 'owner'],
        where: {
          owner: { username },
        },
      }),
    ).pipe(
      map((todos: TodoEntity[]) => {
        let listTodo: TodoDto[] = todos.map((todo: TodoEntity) =>
          toTodoDto(todo),
        )
        const todoList: TodoListDtos = {
          todos: listTodo,
        }

        return todoList
      }),
    )
  }

  getOneTodo(id: string, { username }: UserDto): Observable<TodoDto> {
    // return from(this.todos).pipe(
    //   find((todo: TodoEntity) => todo.id === id),
    //   catchError((err) => {
    //     throw new HttpException(
    //       'Todo item does not exist',
    //       HttpStatus.BAD_REQUEST,
    //     )
    //   }),
    // )

    return from(
      this.todoRepository.findOne(id, {
        relations: ['owner'],
        where: { owner: username },
      }),
    ).pipe(
      map((todo: TodoEntity) => {
        if (todo) return toTodoDto(todo)
      }),
    )
  }

  createTodo(
    { username }: UserDto,
    todoDto: TodoCreateDto,
  ): Observable<TodoDto> {
    Logger.log(`createTodo username ${username}`, 'TodoService')
    return from(this.userService.findOneUser({ where: { username } })).pipe(
      switchMap((user: UserEntity) => {
        Logger.log(`createTodo user ${user}`, 'TodoService')

        const { name, description } = todoDto
        const new_todo: Partial<TodoEntity> = {
          name,
          description,
          owner: user,
        }

        return from(this.todoRepository.save(new_todo)).pipe(
          switchMap((todo: TodoEntity) => {
            return of(toTodoDto(todo))
          }),
        )
      }),
    )
  }

  // public updateTodo(id: string, todo: TodoDto): Observable<TodoDto> {
  public updateTodo(todo: TodoDto): Observable<UpdateResult> {
    // return this.getOneTodo(id).pipe(
    //   map((currentTodo: TodoDto) => {
    //     let desiredTodoEntityIndex: number
    //     const desiredTodoEntity: TodoEntity = this.todos.find(
    //       (todoEntity: TodoEntity, index: number) => {
    //         if (todoEntity.id === id) {
    //           desiredTodoEntityIndex = index
    //           return true
    //         }
    //       },
    //     )

    //     this.todos[desiredTodoEntityIndex] = {
    //       id,
    //       name: todo.name,
    //       description: todo.description,
    //     }

    //     return this.todos[desiredTodoEntityIndex]
    //   }),
    // )

    return from(this.todoRepository.update(todo.id, todo)).pipe(
      catchError((err) => {
        throw new HttpException(
          'Todo item does not exist',
          HttpStatus.BAD_REQUEST,
        )
      }),
    )
    // return from(this.todoRepository.findOne(id)).pipe(
    //   map((founded_todo: TodoEntity) => {
    //     return from(this.todoRepository.update(id, { todo }))
    //   })
    // )
  }

  // deleteTodo(id: string): Observable<TodoDto> {
  // return from(this.todos).pipe(
  //   find((todo: TodoEntity) => todo.id === id),
  //   tap((todo: TodoEntity) => {
  //     this.todos = this.todos.filter(
  //       (removedTodo: TodoEntity) => removedTodo.id !== todo.id,
  //     )
  //     return toTodoDto(todo)
  //   }),
  // )

  deleteTodo(id: string, user: UserDto): Observable<DeleteResult> {
    return from(this.todoRepository.findOne(id)).pipe(
      switchMap((todo: TodoEntity) => {
        if (!todo) {
          throw new HttpException(
            'Todo item does not exist',
            HttpStatus.NOT_FOUND,
          )
        }

        if (todo.owner?.username !== user.username) {
          throw new HttpException(
            'Current user do not own this todo item',
            HttpStatus.UNAUTHORIZED,
          )
        }

        return from(this.todoRepository.delete(id))
      }),
    )
    // return from(this.todoRepository.delete(id)).pipe(
    //   tap((result: DeleteResult) => {
    //     if(result.affected === 0) {
    //       thr
    //     }
    //   })
    // )
  }
}
