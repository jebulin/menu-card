import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class VerifyUrlNameDto {

    @IsNotEmpty()
    @ApiProperty()
    urlName: string;

}
