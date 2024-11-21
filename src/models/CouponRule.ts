import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Coupon } from './Coupon';

@Entity('coupon_rules')
export class CouponRule {
  @PrimaryGeneratedColumn('identity', {
    name: 'rule_id',
    type: 'integer'
  })
  ruleId!: number;

  @Column({
    name: 'coupon_id',
    type: 'varchar',
    length: 20
  })
  couponId!: string;

  @Column({
    name: 'rule_type',
    type: 'varchar',
    length: 20,
    enum: ['min_spend', 'specific_items', 'first_purchase', 'birthday', 'new_user', 'time_limit']
  })
  ruleType!: string;

  @Column({
    name: 'rule_value',
    type: 'json'
  })
  ruleValue!: any;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true
  })
  description?: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt!: Date;

  @ManyToOne(() => Coupon, coupon => coupon.rules, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'coupon_id' })
  coupon!: Coupon;
}