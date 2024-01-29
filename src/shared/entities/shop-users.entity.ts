import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base.entity";

@Entity()
export class ShopUsers extends Base{

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    shopId:number;

    @Column()
    userId:number;

    @Column()
    roleId:number;

    
}