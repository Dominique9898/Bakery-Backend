import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  VirtualColumn
} from 'typeorm';
import { Order } from './Order';
import { Product } from './Product';

@Entity('order_items')
export class OrderItem {
  @PrimaryColumn({
    name: 'order_item_id',
    type: 'varchar',
    length: 15
  })
  orderItemId!: string;

  @Column({
    name: 'order_id',
    type: 'varchar',
    length: 25
  })
  orderId!: string;

  @Column({
    name: 'product_id',
    type: 'varchar',
    length: 15,
    nullable: true
  })
  productId?: string;

  @Column({
    type: 'integer',
    nullable: false
  })
  quantity!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false
  })
  price!: number;

  @Column({
    name: 'total_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    generatedType: 'STORED',
    asExpression: 'quantity * price'
  })
  totalPrice!: number;

  @ManyToOne(() => Order, order => order.orderItems, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => Product, product => product.orderItems, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'product_id' })
  product?: Product;
}