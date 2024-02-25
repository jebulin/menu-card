import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";
import { CreateSessionProductDto } from "./create-session-product.dto";

export class UpdateSessionProductDto extends PartialType(CreateSessionProductDto) {

    updatedBy?: number;

    @IsNotEmpty()
    @ApiProperty()
    status:number;
}
