import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStratergy } from 'src/auth/local.auth';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [UsersModule, PassportModule,
    JwtModule.register({
        secret: '12345',
        signOptions: {expiresIn: '60s'},
    })],
    controllers: [AuthController],
    providers: [AuthService, LocalStratergy]
})
export class AuthModule {}
