import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesAllowed } from 'src/auth/Decorator/roles.decorator';
import { Roles } from 'src/shared/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() userDto: UserDto,@Request() req:any) {
    return await this.usersService.create(userDto, req.user);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @RolesAllowed(Roles.ADMIN_USER,Roles.SUPER_ADMIN)
  @Get()
  async findAll(@Request() req:any) {
    console.log(req.user)
    // console.log(req.username)
    return await this.usersService.findAll();
  }

  @Post('email')
  findOneByEmail(@Body() data: {email: string}) {
    return this.usersService.findOneByEmail(data.email);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.usersService.findOneById(+id);
  }

  

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
