import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Order } from './Order';
import { User } from './User';

@Entity('payment_log')
export class PaymentLog {
  @PrimaryColumn({
    name: 'payment_id',
    type: 'varchar',
    length: 25
  })
  paymentId!: string;

  @Column({
    name: 'order_id',
    type: 'varchar',
    length: 25
  })
  orderId!: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 20,
    nullable: true
  })
  userId?: string;

  @Column({
    name: 'transaction_id',
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false
  })
  transactionId!: string;

  @Column({
    name: 'payment_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false
  })
  paymentAmount!: number;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'success',
    enum: ['success', 'failed']
  })
  status!: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @ManyToOne(() => Order, order => order.paymentLogs, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => User, user => user.userId, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}