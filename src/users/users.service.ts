import { HttpException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist';
import { Repository } from 'typeorm';
import { UserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userDto: UserDto, loggeduser) {
    try {
      userDto.createdBy = loggeduser.id;

      let alreadyDataPresent = await this.findOneByEmail(userDto.email);
      if (alreadyDataPresent) {
        return { message: 'User already present', statusCode: 500 };
      }

      let password = await bcrypt.hash(
        userDto.password,
        await bcrypt.genSalt(),
      );
        
      userDto.password = password;
      if (userDto.roleId != 1 && userDto.hasOwnProperty("startDate") && userDto.hasOwnProperty("endDate")){
        delete userDto.startDate ;
        delete userDto.endDate ;
      }
      let s = await this.userRepository.save(userDto);
      return s.email;
    } catch (err) {
      console.log(err)
      throw new HttpException('Jebulin', 500);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  findOneById(id: number) {
    let user = this.userRepository.findOneBy({ id: id });
    return user;
  }

  findOneByEmail(email: string) {
    let user = this.userRepository.findOneBy({ email: email });
    return user;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
