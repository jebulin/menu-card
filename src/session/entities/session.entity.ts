import { Base } from "src/shared/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('sessions')
@Unique(['shopId', "name"])
export class Session extends Base {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "shop_id" })
    shopId: number;

    @Column()
    name: string;

    @Column({ name: "start_time", type: "time" })
    startTime: string;

    @Column({ name: "end_time", type: "time" })
    endTime: string;
}
