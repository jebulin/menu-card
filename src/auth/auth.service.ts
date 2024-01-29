import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as  generator from 'generate-password';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
        private jwtService: JwtService) { }

    async validateUser(username: string, password: string) {
        const user = await this.usersService.findOneByEmail(username);

        if (!user) {
            return 'could not find the user';
        }

        const passwordValid = await bcrypt.compare(password, user.password)
        
        if (passwordValid) {

            return user;
        }

        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, id: user.id, roles: [user.roleId] };
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
