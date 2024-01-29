import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { ShopUsers } from 'src/shared/entities/shop-users.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Shop, ShopUsers])],
  controllers: [ShopController],
  providers: [ShopService]
})
export class ShopModule {}
