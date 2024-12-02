import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { OperationLog } from './OperationLog';

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: 管理员ID
 *         username:
 *           type: string
 *           description: 管理员用户名
 *         password:
 *           type: string
 *           description: 管理员密码
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 */

@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn('identity', {
    name: 'admin_id',
    type: 'integer'
  })
  adminId!: number;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false
  })
  username!: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
    nullable: false
  })
  passwordHash!: string;

  @CreateDateColumn({
    name: 'created_at'
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at'
  })
  updatedAt!: Date;

  @OneToMany(() => OperationLog, log => log.admin)
  operationLogs?: OperationLog[];
}