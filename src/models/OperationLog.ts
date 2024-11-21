import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Admin } from './Admin';

@Entity('operation_logs')
export class OperationLog {
  @PrimaryColumn({
    name: 'log_id',
    type: 'varchar',
    length: 30
  })
  logId!: string;

  @Column({
    name: 'admin_id',
    type: 'integer',
    nullable: true
  })
  adminId?: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  action!: string;

  @Column({
    name: 'target_id',
    type: 'integer',
    nullable: true
  })
  targetId?: number;

  @Column({
    type: 'text',
    nullable: true
  })
  description?: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @ManyToOne(() => Admin, admin => admin.operationLogs, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'admin_id' })
  admin?: Admin;
}