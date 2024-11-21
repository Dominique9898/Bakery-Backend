import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User';
import { Coupon } from './Coupon';

@Entity('user_coupons')
export class UserCoupon {
  @PrimaryColumn({
    name: 'user_coupon_id',
    type: 'varchar',
    length: 15
  })
  userCouponId!: string;

  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 20
  })
  userId!: string;

  @Column({
    name: 'coupon_id',
    type: 'varchar',
    length: 20
  })
  couponId!: string;

  @Column({
    name: 'is_used',
    type: 'boolean',
    default: false
  })
  isUsed!: boolean;

  @CreateDateColumn({
    name: 'received_at'
  })
  receivedAt!: Date;

  @Column({
    name: 'used_at',
    type: 'timestamp',
    nullable: true
  })
  usedAt?: Date;

  @ManyToOne(() => User, user => user.userCoupons, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Coupon, coupon => coupon.userCoupons, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'coupon_id' })
  coupon!: Coupon;
}