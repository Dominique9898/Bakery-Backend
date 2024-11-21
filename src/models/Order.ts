import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';
import { User } from './User';
import { Coupon } from './Coupon';
import { OrderItem } from './OrderItem';
import { PaymentLog } from './PaymentLog';
import { DeliveryTracking } from './DeliveryTracking';
import { RiskLog } from './RiskLog';

@Entity('orders')
export class Order {
  @PrimaryColumn({
    name: 'order_id',
    type: 'varchar',
    length: 25
  })
  orderId!: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 20
  })
  userId!: string;

  @Column({
    name: 'courier_id',
    type: 'varchar',
    length: 20,
    nullable: true
  })
  courierId?: string;

  @Column({
    name: 'delivery_status',
    type: 'varchar',
    length: 15,
    default: 'pending',
    enum: ['pending', 'delivering', 'completed']
  })
  deliveryStatus!: string;

  @Column({
    name: 'delivery_type',
    type: 'varchar',
    length: 10,
    nullable: false,
    enum: ['pickup', 'delivery']
  })
  deliveryType!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  address?: string;

  @Column({
    type: 'timestamp',
    nullable: true
  })
  eta?: Date;

  @Column({
    name: 'coupon_id',
    type: 'varchar',
    length: 20,
    nullable: true
  })
  couponId?: string;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0
  })
  discountAmount!: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false
  })
  totalAmount!: number;

  @Column({
    type: 'varchar',
    length: 15,
    default: 'paid',
    enum: ['paid', 'completed', 'canceled'] // ['pending', 'processing', 'completed', 'cancelled']
  })
  status!: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.orders, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => User, user => user.deliveries, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'courier_id' })
  courier?: User;

  @ManyToOne(() => Coupon, coupon => coupon.orders, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'coupon_id' })
  coupon?: Coupon;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  orderItems?: OrderItem[];

  @OneToMany(() => PaymentLog, paymentLog => paymentLog.order)
  paymentLogs?: PaymentLog[];

  @OneToMany(() => DeliveryTracking, tracking => tracking.order)
  deliveryTrackings?: DeliveryTracking[];

  @OneToMany(() => RiskLog, riskLog => riskLog.order)
  riskLogs?: RiskLog[];

  @Column({
    name: 'points_used',
    type: 'integer',
    default: 0,
    comment: '使用的积分数量'
  })
  pointsUsed!: number;

  @Column({
    name: 'points_discount_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: '积分抵扣金额'
  })
  pointsDiscountAmount!: number;

  @Column({
    name: 'coupon_discount_amount', 
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: '优惠券折扣金额'
  })
  couponDiscountAmount!: number;

  @Column({
    name: 'final_amount',
    type: 'decimal', 
    precision: 10,
    scale: 2,
    comment: '最终支付金额'
  })
  finalAmount!: number;
}