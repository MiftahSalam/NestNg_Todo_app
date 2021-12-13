import { TaskEntity } from '@todo/entities/task.entity'
import { UserEntity } from 'src/user/entities/user.entity'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm'

@Entity('todo')
export class TodoEntity {
  @PrimaryGeneratedColumn('uuid') id: string
  @Column({ type: 'varchar', nullable: false }) name: string
  @Column({ type: 'text', nullable: true }) description?: string
  @CreateDateColumn() createdOn?: Date
  @CreateDateColumn() updatedOn?: Date

  @OneToMany((type) => TaskEntity, (task) => task.todo, { cascade: true })
  tasks?: TaskEntity[]

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' }) owner?: UserEntity
}
