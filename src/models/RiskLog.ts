import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User';
import { Order } from './Order';

@Entity('risk_logs')
export class RiskLog {
  @PrimaryColumn({
    name: 'risk_log_id',
    type: 'varchar',
    length: 25
  })
  riskLogId!: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 20
  })
  userId!: string;

  @Column({
    name: 'order_id',
    type: 'varchar',
    length: 25,
    nullable: true
  })
  orderId?: string;

  @Column({
    name: 'risk_type',
    type: 'varchar',
    length: 30,
    enum: ['bulk_orders', 'coupon_abuse', 'suspicious_behavior']
  })
  riskType!: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description?: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @ManyToOne(() => User, user => user.userId, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Order, order => order.riskLogs, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'order_id' })
  order?: Order;
}