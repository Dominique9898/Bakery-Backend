import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Product } from './Product';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('identity', {
    name: 'category_id',
    type: 'integer'
  })
  categoryId!: number;

  @Column({
    name: 'category_name',
    type: 'varchar',
    length: 50,
    nullable: false,
    unique: true
  })
  categoryName!: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt!: Date;

  @OneToMany(() => Product, product => product.category)
  products?: Product[];
}