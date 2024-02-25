import { Base } from "src/shared/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("product")
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: 'shop_id'})
    shopId: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    type: string;

    @Column({ nullable: true })
    category: string;

    @Column({ type: "text", nullable:true })
    description: string;

    @Column()
    price: number;

    @Column({default: 1})
    stock: string;

    @Column({ name: "created_by", nullable: true })
    createdBy: number;

    @Column({ name: "created_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: string;

    @Column({ name: "updated_by", nullable: true })
    updatedBy: number;

    @Column({ name: "updated_at", type: "timestamp", default: () => "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP" })
    updatedAt: string;

    @Column({ default: 1 })
    status: number;


}
