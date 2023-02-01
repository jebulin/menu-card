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

  async create(userDto: UserDto) {
    try {
      userDto.createdBy = 1;

      let alreadyDataPresent = await this.findOneByEmail(userDto.email);
      if (alreadyDataPresent) {
        return { message: 'User already present', statusCode: 500 };
      }

      let password = await bcrypt.hash(
        userDto.password,
        await bcrypt.genSalt(),
      );

      userDto.password = password;

      let s = await this.userRepository.save(userDto);
      return s;
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
