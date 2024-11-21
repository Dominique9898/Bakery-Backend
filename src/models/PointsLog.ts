import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity('points_log')
export class PointsLog {
  @PrimaryColumn({
    name: 'points_log_id',
    type: 'varchar',
    length: 20
  })
  pointsLogId!: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 20
  })
  userId!: string;

  @Column({
    type: 'integer',
    nullable: false
  })
  points!: number;

  @Column({
    name: 'action_type',
    type: 'varchar',
    length: 20,
    enum: ['purchase', 'review', 'signup', 'birthday']
  })
  actionType!: string;

  @Column({
    name: 'related_id',
    type: 'integer',
    nullable: true
  })
  relatedId?: number;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @ManyToOne(() => User, user => user.pointsLogs, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}