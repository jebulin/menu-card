import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateProductDto {

    @IsNotEmpty()
    @ApiProperty()
    name: string ;

    @IsNotEmpty()
    @ApiProperty()
    price: number ;

    @IsNotEmpty()
    @ApiProperty()
    stock: string ;

    // @IsNotEmpty()
    // @ApiProperty()
    shopId?: number ;

    @IsNotEmpty()
    @ApiProperty()
    category: string ;

    @IsNotEmpty()
    @ApiProperty()
    description: string ;

    createdBy: number ;

}
