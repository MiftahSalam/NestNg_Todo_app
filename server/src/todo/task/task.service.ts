import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { toTaskDto } from '@shared/mapper'
import { CreateTaskDto } from '@todo/dtos/task-create.dto'
import { TaskDto } from '@todo/dtos/task.dto'
import { TaskEntity } from '@todo/entities/task.entity'
import { TodoEntity } from '@todo/entities/todo.entity'
import { from, map, Observable, of, switchMap, take, tap } from 'rxjs'
import { UserDto } from 'src/user/dtos/user.dto'
import { DeleteResult, getConnection, Repository } from 'typeorm'

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  getTask(id: string, user: UserDto): Observable<TaskDto> {
    return from(
      this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.todo', 'todo')
        .leftJoinAndSelect('todo.owner', 'owner')
        .where('task.id = :taskId', { taskId: id })
        .getOne(),
    ).pipe(
      switchMap((task: TaskEntity) => {
        if (!task) {
          throw new HttpException('Task does not exist', HttpStatus.NOT_FOUND)
        }

        if (task.todo.owner?.username !== user.username) {
          throw new HttpException(
            'Current user do not own this task item',
            HttpStatus.UNAUTHORIZED,
          )
        }

        return of(toTaskDto(task))
      }),
    )

    // return from(this.taskRepository.findOne(id)).pipe(
    //   tap((task: TaskEntity) => {
    //     if (!task) {
    //       throw new HttpException('Task does not exist', HttpStatus.NOT_FOUND)
    //     }

    //     return of(toTaskDto(task))
    //   }),
    // )
  }

  getTaskByTodo(todoId: string, user: UserDto): Observable<TaskDto[]> {
    return from(
      this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.todo', 'todo')
        .leftJoinAndSelect('todo.owner', 'owner')
        .where('todo.id = :todoId', { todoId })
        .getMany(),
    ).pipe(
      switchMap((tasks: TaskEntity[]) => {
        if (tasks.length > 0) {
          Logger.log(
            `getTaskByTodo. tasks[0] ${JSON.stringify(tasks[0])}`,
            'TaskService',
          )
          if (tasks[0].todo.owner?.username !== user.username) {
            throw new HttpException(
              'Current user do not own this task item',
              HttpStatus.UNAUTHORIZED,
            )
          }
        }

        return of(tasks)
      }),
    )
  }

  createTask(
    todoId: string,
    user: UserDto,
    taskDto: CreateTaskDto,
  ): Observable<TaskDto> {
    Logger.log(`CreateTask. todoId ${todoId}`, 'TaskService')
    return from(
      this.todoRepository.findOne({
        where: { id: todoId },
        relations: ['owner'],
      }),
    ).pipe(
      switchMap((todo: TodoEntity) => {
        if (!todo) {
          throw new HttpException(
            'Todo item does not exist',
            HttpStatus.BAD_REQUEST,
          )
        }
        /**/
        Logger.log(`CreateTask. todo ${JSON.stringify(todo)}`, 'TaskService')
        Logger.log(
          `CreateTask. owner ${todo.owner?.username} user ${user.username}`,
          'TaskService->CreateTask',
        )

        if (todo.owner.username !== user.username) {
          throw new HttpException(
            'Current user do not own this todo item',
            HttpStatus.UNAUTHORIZED,
          )
        }
        const task: Partial<TaskEntity> = {
          name: taskDto.name,
          todo: todo,
        }
        // console.log('createTask-pipe-map todo', todo)

        return from(this.taskRepository.save(task)).pipe(
          map((task: TaskEntity) => {
            // console.log('createTask-pipe-map task', task)

            return toTaskDto(task)
          }),
        )
      }),
    )
  }

  async tesQueryBuilder() {
    const id = '1ef1616f-17ee-404d-b0d8-d92ce0522350'
    const id1 = '4008817a-a1d8-4d98-9b59-64f7bbb0f2b1'
    const result = await getConnection()
      .createQueryBuilder(TaskEntity, 'task')
      .leftJoinAndSelect('task.todo', 'todo')
      // .leftJoinAndSelect('todo.tasks', 'task')
      .leftJoinAndSelect('todo.owner', 'owner')
      .andWhere('task.id = :taskId', { taskId: id1 })
      .getOne()

    Logger.log(
      `tesQueryBuilder. result ${JSON.stringify(result.todo.owner)}`,
      'TaskService-tesQueryBuilder',
    )
  }

  deleteTask(id: string, user: UserDto): Observable<DeleteResult> {
    Logger.log(
      `deleteTask. taskId ${id} username ${user.username}`,
      'TaskService-deleteTask',
    )

    // this.tesQueryBuilder()

    return from(
      this.taskRepository
        .createQueryBuilder('task')
        .leftJoinAndSelect('task.todo', 'todo')
        .leftJoinAndSelect('todo.owner', 'owner')
        .where('task.id = :taskId', { taskId: id })
        .getOne(),
    ).pipe(
      switchMap((task: TaskEntity) => {
        if (!task) {
          throw new HttpException('Task does not exist', HttpStatus.NOT_FOUND)
        }

        if (task.todo.owner?.username !== user.username) {
          throw new HttpException(
            'Current user do not own this task item',
            HttpStatus.UNAUTHORIZED,
          )
        }

        /*
        const dummyResult: DeleteResult = {
          raw: 'this is dummy response',
          affected: 0,
        }
        return of(dummyResult)
        */

        return this.taskRepository.delete(id)
      }),
    )
    /*
    return from(this.taskRepository.findOne(id, { relations: ['todo'] })).pipe(
      switchMap((task: TaskEntity) => {

        return from(
          this.todoRepository.findOne(task.todo.id, { relations: ['owner'] }),
        ).pipe(
          switchMap(({ owner }: TodoEntity) => {
            if (!owner) {
              throw new HttpException(
                'Todo not owned by anyone',
                HttpStatus.NOT_IMPLEMENTED,
              )
            }

            if (owner.username !== user.username) {
              throw new HttpException(
                'Current user do not own this todo item',
                HttpStatus.UNAUTHORIZED,
              )
            }

            return this.taskRepository.delete(id)
          }),
        )
      }),
    )
    */
  }
}
