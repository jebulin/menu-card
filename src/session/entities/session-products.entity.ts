import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('session_products')
@Unique(['shopId', "productId"])
export class SessionProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "shop_id" })
    shopId: number;

    @Column({ name: "session_id" })
    sessionId: number;

    @Column({ name: "product_id" })
    productId: number;

    @Column({ name: "created_by" })
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
