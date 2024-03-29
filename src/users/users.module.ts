import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { User } from './entities/user.entity';
import { ShopUsers } from 'src/shared/entities/shop-users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ShopUsers])],
  controllers: [UsersController], 
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
