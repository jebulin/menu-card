import { PartialType } from '@nestjs/mapped-types';
import { CreateShopDto } from './create-shop.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateShopDto extends PartialType(CreateShopDto) {
    @IsNotEmpty()
    @ApiProperty()
    id: number;

    updatedBy?:number;
}
