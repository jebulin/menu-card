import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { LocalStratergy } from 'src/auth/stratergies/local.stratergy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JWTStratergy } from './stratergies/jwt.stratergy';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [UsersModule, PassportModule,
    JwtModule.register({
        secret: '12345',
        signOptions: {expiresIn: '60000s'},
    })],
    controllers: [AuthController],
    providers: [AuthService, LocalStratergy,JWTStratergy, RolesGuard]
})
export class AuthModule {}
