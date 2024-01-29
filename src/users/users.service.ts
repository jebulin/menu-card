import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { UserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ShopUsers } from 'src/shared/entities/shop-users.entity';
import { ResetPasswordDTO } from './dto/reset-password-dto';
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

  async create(userDto: UserDto, loggeduser) {
    try {
      userDto.createdBy = loggeduser.id;
      let roleId = userDto.roleId || 0;

      let savedUser = null;

      if (loggeduser.email == userDto.email) {
        throw { statusCode: 409, message: "User already exist" }
      }

      this.checkRole(roleId, loggeduser);

      let user = await this.findOneByEmail(userDto.email);

      if (user && (user.roleId == Roles.SUPER_ADMIN)) {
        throw { statusCode: 409, message: "User already exist" }
      }

      if (roleId == Roles.PILOT || roleId == Roles.CO_PILOT || roleId == Roles.OWNER) {
        userDto.roleId = 0;
      }
      let password = this.generatePassword();
      if (user) {

        delete userDto.firstName;
        // delete userDto.lastName;
        this.userRepository.merge(user, userDto);
        user.password = password;
        user.status = STATUS.Active;
        user.updatedBy = loggeduser.id;
        user = await this.userRepository.save(user);

      } else {
        userDto.createdBy = loggeduser.id;
      }

      // if (alreadyUserPresent) {

      //   let shopUsers = await this.shopUsersRepository.findOne({ where: { shopId: userDto.shopId, userId: userDto.id } })
      //   if (shopUsers) {
      //     return { message: 'User already present', statusCode: 302 };
      //   }
      // } else {
      //   let password = await this.encryptPassword(userDto.password);

      //   userDto.password = password;
      //   savedUser = await this.userRepository.save(userDto);
      // }


      // let shopUser: Partial<ShopUsers> = {
      //   shopId: userDto.shopId,
      //   createdBy: loggeduser.id
      // }

      // shopUser.userId = alreadyUserPresent ? alreadyUserPresent.id : savedUser.id;

      // await this.shopUsersRepository.save(shopUser);


      // savedUser = alreadyUserPresent ? alreadyUserPresent : savedUser

      // return this.santitizeUser(savedUser);

    } catch (err) {
      console.log(err)
      throw new HttpException('Error in user create', 500);
    }
  }

  // async findAll() {
  //   return await this.userRepository.find();
  // }

  // findOneById(id: number) {
  //   let user = this.userRepository.findOneBy({ id: id });
  //   return user;
  // }

  findOneByEmail(email: string) {
    let user = this.userRepository.findOneBy({ email: email });
    return user;
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }

  // async changePassword(resetPassword: ResetPasswordDTO, loggedUser: any) {

  //   let user = await this.findOneById(loggedUser.id);

  //   return await this.resetPassword(user.email, resetPassword.oldPassword, resetPassword.newPassword);

  // }

  async resetPassword(email: string, oldPassword: string, type: string = "change password") {
    try {
      let user = await this.findOneByEmail(email);
      if (!user) return { message: "Email id not present", statusCode: 404 };

      if (type == "change password") {
        let comparePassword = await bcrypt.compare(oldPassword, user.password);
        if (!comparePassword) {
          throw new HttpException("entered password is wrong", 400);
        }
      }
      let newPassword = this.generatePassword()
      console.log("reset Password:   ", email, "Password: ", newPassword);


      console.log("new password: ", newPassword)
      user.password = await this.encryptPassword(newPassword);

      await this.userRepository.save(user);

      return "Password reset success";
    } catch (err) {
      console.log(err);
      throw err.message;
    }
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
}
