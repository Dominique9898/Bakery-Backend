import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Order } from './Order';
import { User } from './User';

@Entity('delivery_tracking')
export class DeliveryTracking {
  @PrimaryColumn({
    name: 'tracking_id',
    type: 'varchar',
    length: 15
  })
  trackingId!: string;

  @Column({
    name: 'order_id',
    type: 'varchar',
    length: 25
  })
  orderId!: string;

  @Column({
    name: 'courier_id',
    type: 'varchar',
    length: 20
  })
  courierId!: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: false
  })
  latitude!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
    nullable: false
  })
  longitude!: number;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt!: Date;

  @ManyToOne(() => Order, order => order.deliveryTrackings, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => User, user => user.userId, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'courier_id' })
  courier!: User;
}