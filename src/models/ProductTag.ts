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
  @PrimaryGeneratedColumn('increment')
  tagId!: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  name!: string;  // 例如：'状态', '冰量', '甜度', '小料'

  @Column({
    type: 'boolean',
    default: true
  })
  required!: boolean;  // 是否必选

  @Column({
    type: 'boolean',
    default: false
  })
  multiSelect!: boolean;  // 是否可多选

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ProductTagOption, option => option.tag)
  options!: ProductTagOption[];

  @ManyToMany(() => Product, product => product.tags)
  products!: Product[];
} 