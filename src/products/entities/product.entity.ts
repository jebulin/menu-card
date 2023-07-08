import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("product")
export class Product {
    @PrimaryGeneratedColumn()
    id: number ;

    @Column()
    name: string ;

    @Column()
    type: string ;

    @Column()
    category: string ;

    @Column({type:"text"})
    description: string ;

    @Column({name: "created_by", nullable:true})
    createdBy: number ;

    @Column({name: "created_at", type: "timestamp", default: ()=> "CURRENT_TIMESTAMP"})
    createdAt: string ;

    @Column({name: "updated_by", nullable:true})
    updatedBy: number ;

    @Column({name: "updated_at", type: "timestamp", default: ()=> "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"})
    updatedAt: string ;

    @Column({default: 1})
    status: number ;

}
