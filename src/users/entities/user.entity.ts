import { Base } from 'src/shared/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: "phone_number",nullable: true })
    phoneNumber: string;


    @Column({ name: "role_id" })
    roleId: number;

    @Column()
    password: string;

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
