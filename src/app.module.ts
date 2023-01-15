import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "password",
    "database":"menu_card",
    "synchronize": true,
    "entities": ["dist/**/*.entity{.js,.ts}"]
}),
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
