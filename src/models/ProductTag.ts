import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany
} from 'typeorm';
import { Product } from './Product';
import { ProductTagOption } from './ProductTagOption';

@Entity('product_tags')
export class ProductTag {
  @PrimaryGeneratedColumn('identity', {
    name: 'tag_id',
  })
  tagId!: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 50,
    nullable: false
  })
  name!: string;  // 例如：'状态', '冰量', '甜度', '小料'

  @Column({
    name: 'required',
    type: 'boolean',
    default: true
  })
  required!: boolean;  // 是否必选

  @Column({
    name: 'multi_select',
    type: 'boolean',
    default: false
  })
  multiSelect!: boolean;  // 是否可多选

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt!: Date;

  @OneToMany(() => ProductTagOption, option => option.tag)
  options!: ProductTagOption[];

  @ManyToMany(() => Product, product => product.tags)
  products!: Product[];
} 