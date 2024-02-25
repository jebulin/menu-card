import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateSessionProductDto {

    shopId?:number
    
    @IsNotEmpty()
    @ApiProperty()
    sessionId:number

    @IsNotEmpty()
    @ApiProperty()
    productId: number;

    createdBy?: number;
}
