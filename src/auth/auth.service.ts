import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService:UsersService, 
        private jwtService:JwtService){}

        async validateUser(username:string, password: string){
            const user = await this.usersService.findOneByEmail(username);
            if (!user) return null;
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!user) {
            return 'could not find the user';
        }
        if (user && passwordValid) {
            return user;
        }

        return null;
        }

        async login(user: any) {
            console.log(user)
            const payload = { email: user.email, id: user.id, roles:[user.roleId] };
            return {
                access_token: this.jwtService.sign(payload),
            };
        }
}
