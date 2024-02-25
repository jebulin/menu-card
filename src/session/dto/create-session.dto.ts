import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateSessionDto {
    id?: number;
    
    shopId?:number

    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    startTime: string;

    @IsNotEmpty()
    @ApiProperty()
    endTime: string;

    createdBy?: number;
}
