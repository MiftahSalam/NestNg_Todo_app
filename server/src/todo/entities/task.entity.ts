import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm'

import { TodoEntity } from '@todo/entities/todo.entity'

@Entity('task')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ type: 'varchar', nullable: false }) name: string
  @CreateDateColumn() createdOn?: Date

  @ManyToOne((type) => TodoEntity, (todo) => todo.tasks, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  todo: TodoEntity
}
