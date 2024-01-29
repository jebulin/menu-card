import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as  generator from 'generate-password';
import { User } from 'src/users/entities/user.entity';
import { Shop } from 'src/shop/entities/shop.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopUsers } from './entities/shop-users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShopUserService {
    constructor(@InjectRepository(ShopUsers) private readonly shopuserRepository: Repository<ShopUsers>) { }

    async createshopUser(user: User, shop: Shop) {
        try {
            let shopuserData: Partial<ShopUsers> = {
                shopId: shop.id,
                userId: user.id,
                roleId: user.roleId
            }
            await this.shopuserRepository.save(shopuserData)
            return true;
        } catch (err) {
            console.log("shop User create error: ", err);
            // throw new HttpException("Error in shop users", 400)
        }
        return false;
    }

    async editUserRole(shopUser:ShopUsers, roleId:number) {
        try {
            // let shopUserAlreadyPresent = await this.shopuserRepository.find({where:{id:shopUser.roleId}})
            // let shopuserData: Partial<ShopUsers> = {
            //     shopId: shop.id,
            //     userId: user.id,
            //     roleId: user.roleId
            // }
            // await this.shopuserRepository.save(shopuserData)
            // return true;
        } catch (err) {
            console.log("shop User create error: ", err);
            // throw new HttpException("Error in shop users", 400)
        }
        return false;
    }


}
