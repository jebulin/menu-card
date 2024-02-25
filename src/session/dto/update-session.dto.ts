import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {

    @IsNotEmpty()
    @ApiProperty()
    status:number
}
