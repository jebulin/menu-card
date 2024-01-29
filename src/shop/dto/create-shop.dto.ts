import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateShopDto {

    @IsNotEmpty()
    @ApiProperty()
    name: string;

    @IsNotEmpty()
    @ApiProperty()
    urlName: string;

    // address: string;

    // shopType: string;

    // startDate:string;

    //     @IsOptional()
    //   @ApiProperty()
    //     endDate:string;

    createdBy?: number;

}
