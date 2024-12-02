import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { ProductTag } from './ProductTag';

@Entity('product_tag_options')
export class ProductTagOption {
  @PrimaryGeneratedColumn('increment')
  optionId!: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false
  })
  value!: string;  // 例如：'冰(推荐)', '少冰', '去冰'

  @Column({
    type: 'boolean',
    default: false
  })
  isDefault!: boolean;  // 是否默认选项

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0
  })
  additionalPrice!: number;  // 额外价格

  @Column({
    type: 'integer'
  })
  tagId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => ProductTag, tag => tag.options, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'tagId' })
  tag!: ProductTag;

  @Column({
    type: 'integer',
    default: 0,
    comment: '推荐级别：2=强烈推荐，1=推荐，0=普通，-1=不推荐，-2=强烈不推荐'
  })
  recommendationLevel!: number;
} 