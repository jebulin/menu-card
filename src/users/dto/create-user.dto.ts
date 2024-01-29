import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UserDto {
    id?: number;
    @IsNotEmpty()
    @ApiProperty()
    shopId: number;

    @IsNotEmpty()
    @ApiProperty()
    firstName: string;
    // lastName: string;
    email: string;
    roleId: number;
    // phoneNumber:string;
    password: string;
    createdBy?: number;
    createdAt?: string;
    updatedBy?: number;
    updatedAt?: string;
    status?: number;
}
