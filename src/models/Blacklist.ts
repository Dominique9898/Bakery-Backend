import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User';

@Entity('blacklist')
export class Blacklist {
  @PrimaryGeneratedColumn('identity', {
    name: 'blacklist_id',
    type: 'integer'
  })
  blacklistId!: number;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 20,
    nullable: true
  })
  userId?: string;

  @Column({
    name: 'ip_address',
    type: 'varchar',
    length: 50,
    nullable: true
  })
  ipAddress?: string;

  @Column({
    name: 'device_id',
    type: 'varchar',
    length: 100,
    nullable: true
  })
  deviceId?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  reason?: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @ManyToOne(() => User, user => user.userId, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}