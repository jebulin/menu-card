import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as  generator from 'generate-password';
import { STATUS } from 'src/shared/status.enum';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
        private jwtService: JwtService) { }

    async validateUser(username: string, password: string) {
        const user: any = await this.usersService.findOneByEmail(username);

        if (!user) return user;

        const passwordValid = await bcrypt.compare(password, user.password)

        if (user.roleId == 1) user.roleId = user.roleId;
        else {
            let firstUserShop = await this.usersService.findFirstUserShop({ userId: user.id, status: STATUS.Active });
            user.roleId = firstUserShop.roleId;
        }
        if (passwordValid) return user;

        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, id: user.id, roleId: user.roleId };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async forgotPassword(body: any, loggedUser) {
        try {
            return await this.usersService.resetPassword(body.email, null, "forgotpassword");

        } catch (err) {
            console.log(err);
            throw "Password reset error"
        }
    }
}
