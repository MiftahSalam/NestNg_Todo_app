import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaskEntity } from '@todo/entities/task.entity'
import { TodoEntity } from '@todo/entities/todo.entity'
import { TodoController } from './todo.controller'
import { TodoService } from './todo.service'
import { TaskService } from './task/task.service'
import { TaskController } from './task/task.controller'
import { UserModule } from '../user/user.module'
import { AuthModule } from '../auth/auth.module'
import { UserEntity } from '../user/entities/user.entity'

@Module({
  imports: [
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([TodoEntity, TaskEntity, UserEntity]),
  ],
  controllers: [TodoController, TaskController],
  providers: [TodoService, TaskService],
})
export class TodoModule {}
