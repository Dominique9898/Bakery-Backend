import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
  Index
} from 'typeorm';
import { Category } from './Category';
import { OrderItem } from './OrderItem';
import { ProductTag } from './ProductTag';

@Entity('products')
export class Product {
  @PrimaryColumn({
    name: 'product_id',
    type: 'varchar',
    length: 15
  })
  productId!: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: false
  })
  name!: string;

  @Column({
    type: 'text',
    nullable: true
  })
  description?: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false
  })
  price!: number;

  @Column({
    type: 'integer',
    default: 0
  })
  stock!: number;

  @Column({
    name: 'category_id',
    type: 'integer',
    nullable: true
  })
  categoryId?: number;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'active',
    enum: ['active', 'inactive']
  })
  status!: string;

  @Column({
    name: 'image_url',
    type: 'varchar',
    length: 255,
    nullable: true
  })
  imageUrl?: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt!: Date;

  @ManyToOne(() => Category, category => category.products, {
    onDelete: 'SET NULL'
  })
  @JoinColumn({ name: 'category_id' })
  category?: Category;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems?: OrderItem[];

  @ManyToMany(() => ProductTag, tag => tag.products)
  @JoinTable({
    name: 'product_tag_relations',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'productId'
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'tagId'
    }
  })
  tags?: ProductTag[];
}