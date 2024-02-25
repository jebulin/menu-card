import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { SessionProductService } from './session-products.service';
import { SessionProduct } from './entities/session-products.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Session,SessionProduct])],
  controllers: [SessionController],
  providers: [SessionService, SessionProductService]
})
export class SessionModule {}
