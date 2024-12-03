import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("product_tags")
export class ProductTag {
    @PrimaryGeneratedColumn()
    tag_id: number;

    @Column()
    name: string;

    @Column()
    required: boolean;

    @Column()
    multi_select: boolean;

    @Column()
    created_at: Date;

    @Column()
    updated_at: Date;
} 