import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Order } from './Order';
import { UserCoupon } from './UserCoupon';
import { PointsLog } from './PointsLog';

@Entity('users')
export class User {
  @PrimaryColumn({
    name: 'user_id',
    type: 'varchar',
    length: 20
  })
  userId!: string;

  @Column({
    type: 'varchar',
    length: 15,
    unique: true,
    nullable: false
  })
  phone!: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true
  })
  name?: string;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'customer',
    enum: ['customer', 'courier']
  })
  role!: string;

  @Column({
    type: 'date',
    nullable: true
  })
  birthday?: Date;

  @Column({
    name: 'points_balance',
    type: 'integer',
    default: 0
  })
  pointsBalance!: number;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt!: Date;

  @OneToMany(() => Order, order => order.user)
  orders?: Order[];

  @OneToMany(() => Order, order => order.courier)
  deliveries?: Order[];

  @OneToMany(() => UserCoupon, userCoupon => userCoupon.user)
  userCoupons?: UserCoupon[];

  @OneToMany(() => PointsLog, pointsLog => pointsLog.user)
  pointsLogs?: PointsLog[];
}