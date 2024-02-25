import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UserDto {
    id?: number;

    @IsNotEmpty()
    @ApiProperty()
    firstName: string;

    @IsNotEmpty()
    @ApiProperty()
    lastName: string;

    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    roleId: number;
    // phoneNumber:string;
    password: string;
    createdBy?: number;
    createdAt?: string;
    updatedBy?: number;
    updatedAt?: string;
    status?: number;
}
