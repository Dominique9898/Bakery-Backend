import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Order } from './Order';
import { CouponRule } from './CouponRule';
import { UserCoupon } from './UserCoupon';

@Entity('coupons')
export class Coupon {
  @PrimaryColumn({
    name: 'coupon_id',
    type: 'varchar',
    length: 20
  })
  couponId!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  name!: string;

  @Column({
    name: 'discount_type',
    type: 'varchar',
    length: 10,
    enum: ['amount', 'percentage']
  })
  discountType!: string;

  @Column({
    name: 'discount_value',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false
  })
  discountValue!: number;

  @Column({
    name: 'usage_limit',
    type: 'integer',
    default: 1
  })
  usageLimit!: number;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @Column({
    name: 'expires_at',
    type: 'timestamp',
    nullable: true
  })
  expiresAt?: Date;

  @OneToMany(() => Order, order => order.coupon)
  orders?: Order[];

  @OneToMany(() => CouponRule, rule => rule.coupon)
  rules?: CouponRule[];

  @OneToMany(() => UserCoupon, userCoupon => userCoupon.coupon)
  userCoupons?: UserCoupon[];
}