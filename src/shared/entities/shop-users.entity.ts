import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base.entity";

@Entity()
export class ShopUsers{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    shopId:number;

    @Column()
    userId:number;

    @Column()
    roleId:number;

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