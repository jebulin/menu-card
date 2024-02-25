import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { UserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ShopUsers } from 'src/shared/entities/shop-users.entity';
import { ChangePassDTO } from './dto/reset-password-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/shared/roles.enum';
import { STATUS } from 'src/shared/status.enum';
import * as generator from 'generate-password'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ShopUsers)
    private readonly shopUsersRepository: Repository<ShopUsers>
  ) { }

  async create(userDto: UserDto, loggedUser) {
    try {
      userDto.createdBy = loggedUser.id;
      let roleId = userDto?.roleId || 0;

      this.checkRole(roleId, loggedUser);

      let user = await this.findOneByEmail(userDto.email);

      if (user && (user.roleId == Roles.SUPER_ADMIN)) {
        throw { statusCode: 409, message: "User already exist" }
      }

      if (roleId == Roles.PILOT || roleId == Roles.CO_PILOT || roleId == Roles.OWNER) {
        userDto.roleId = 0;
      }

      if (!user) {
        let password = this.generatePassword();
        userDto.password = await this.encryptPassword(password);
        console.log("password:", password)
        userDto.createdBy = loggedUser.id;
        user = await this.userRepository.save(userDto);
      } else if (user.status in [STATUS.InActive, STATUS.Deleted]) {
        user.status = STATUS.Active;
        user = await this.userRepository.save(user);
      }

      if (user) {

        let shopUser = await this.shopUsersRepository.findOne({ where: { shopId: loggedUser.shopInfo.shopId, userId: user.id } })

        if (shopUser && shopUser.status == STATUS.Active) {
          return { message: 'User already present', statusCode: 302 };
        } else if (shopUser.status in [STATUS.Deleted, STATUS.InActive]) {
          shopUser.updatedBy = loggedUser.id;
          shopUser.status = STATUS.Active;
          await this.shopUsersRepository.save(shopUser);
        } else {
          let shopUser: Partial<ShopUsers> = {
            shopId: loggedUser.shopInfo.shopId,
            userId: user.id,
            createdBy: loggedUser.id
          }
          await this.shopUsersRepository.save(shopUser);
        }
      }

      return this.santitizeUser(user);

    } catch (err) {
      console.log(err)
      throw { message: err.message, statusCode: err.statuCode | 500 };
    }
  }

  async updateDetails(updateuserDTO:UpdateUserDto, loggedUser: any) {

    delete updateuserDTO.roleId;
    delete updateuserDTO.password;

    updateuserDTO.updatedBy = loggedUser.id;

    await this.userRepository.save(updateuserDTO);

    return "Saved succesfully"
  }

  async updateRole(updateuserDTO:UpdateUserDto, loggedUser: any) {

    delete updateuserDTO.password;

    updateuserDTO.updatedBy = loggedUser.id;

    await this.userRepository.save(updateuserDTO);

    return "Saved succesfully"
  }

  async findAll(loggedUser:any) {
    let where = {

    }
    return await this.userRepository.find();
  }

  findOneById(id: number) {
    let user = this.userRepository.findOneOrFail({ where: { id: id } });
    return user;
  }

  findOneByEmail(email: string) {
    let user = this.userRepository.findOneOrFail({where:{ email: email }});
    return user;
  }

  async findFirstUserShop(payload: any) {
    let userShop = await this.shopUsersRepository.findOneBy(payload);
    return userShop;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  async changePassword(changePassDTO: ChangePassDTO, loggedUser: any) {
    let user = await this.findOneById(loggedUser.id);
    let comparePassword = await bcrypt.compare(changePassDTO.oldPassword, user.password);
    if (!comparePassword) {
      throw { statusCode: 400, message: "Old password is wrong" };
    }
    user.password = await this.encryptPassword(changePassDTO.newPassword);

    await this.userRepository.save(user);

    return "Password is changed Succesfully";
  }

  generatePassword() {
    return generator.generate({
      length: 10,
      numbers: true
    });
  }

  async encryptPassword(password: string) {
    return await bcrypt.hash(
      password,
      await bcrypt.genSalt(),
    );
  }


  santitizeUser(user: User) {

    delete user.password;
    delete user.createdAt;
    delete user.createdBy;
    return user;

  }


  public checkRole(roleId: number, loggedUser: any) {
    let roles = [];

    if (loggedUser.roleId == Roles.SUPER_ADMIN) {
      roles = [Roles.SUPER_ADMIN, Roles.OWNER, Roles.PILOT, Roles.CO_PILOT];
    } else if (loggedUser.roleId == Roles.OWNER) {
      roles = [Roles.PILOT, Roles.CO_PILOT];
    } else if (loggedUser.roleId == Roles.PILOT) {
      roles = [Roles.CO_PILOT];
    }

    if (roles.indexOf(roleId) != -1) {
      return true;
    }

    throw ({ "statuCode": 403, "message": "Forbidden Error" })
  }


  async resetPassword(email: string, oldPassword: string, type: string = "change password") {
    try {
      let user = await this.findOneByEmail(email);
      if (!user) return { message: "Email id not present", statusCode: 404 };

      let newPassword = this.generatePassword()
      console.log("reset Password:   ", email, "Password: ", newPassword);


      console.log("new password: ", newPassword)

      await this.userRepository.save(user);

      return "Password reset success";
    } catch (err) {
      console.log(err);
      throw err.message;
    }
  }
}


