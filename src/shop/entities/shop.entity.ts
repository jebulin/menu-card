import { Base } from "src/shared/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Shop {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ name: 'url_name' })
    urlName: string;

    // @Column({ nullable: true })
    // website: string;

    // @Column({ type: 'text' })
    // address: string;

    // @Column()
    // location: string;

    // @Column({ name: "open_time", nullable: true })
    // openTime: string;

    // @Column({ name: "close_time", nullable: true })
    // closeTime: string;

    // @Column()
    // landmark: string;

    // @Column()
    // shopType: string;

    // @Column({ name: "start_date", nullable: true })
    // subscriptionStartDate: string;

    // @Column({ name: "end_date", nullable: true })
    // subscriptionEndDate: string;

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
