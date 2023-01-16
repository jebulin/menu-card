import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStratergy } from 'src/shared/guards/jwt.stratergy';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { LocalStratergy } from 'src/shared/guards/local.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    LocalStratergy,
    JwtStratergy
  ],
  controllers: [AuthController],
})
export class AuthModule {}
