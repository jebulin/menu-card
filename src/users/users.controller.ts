import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesAllowed } from 'src/auth/Decorator/roles.decorator';
import { Roles } from 'src/shared/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptor';
import { ChangePassDTO } from './dto/reset-password-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiHeader, ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guard/jwt.guard';
import { Loggeduser } from 'src/auth/Decorator/loggeduser.decorator';

@Controller('users')
@ApiTags('Users')
@ApiHeader({
  name: 'X-Shop-Id',
  description: 'Shop ID'
})
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiOkResponse()
@ApiNotFoundResponse()
@ApiInternalServerErrorResponse()
@UseGuards(JwtAuthGuard)
@UseInterceptors(RequestInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @RolesAllowed(Roles.SUPER_ADMIN, Roles.OWNER, Roles.PILOT)
  @UseGuards(RolesGuard)
  @Post('create')
  async create(@Body() userDto: UserDto, @Loggeduser() loggedUser: any) {
    return await this.usersService.create(userDto, loggedUser);
  }

  @RolesAllowed(Roles.SUPER_ADMIN, Roles.OWNER, Roles.PILOT)
  @UseGuards(RolesGuard)
  @Post('update-details')
  update(@Body() updateUserDto: UpdateUserDto , @Loggeduser() loggedUser: any) {
    return this.usersService.updateDetails(updateUserDto, loggedUser);
  }

  @RolesAllowed(Roles.SUPER_ADMIN, Roles.OWNER, Roles.PILOT, Roles.CO_PILOT)
  @UseGuards(RolesGuard)
  @Post('change-password')
  async changePassword(@Body() changePassDTO:ChangePassDTO, @Loggeduser() loggedUser: any) {
    return await this.usersService.changePassword(changePassDTO, loggedUser);
  }

  // @RolesAllowed(Roles.SUPER_ADMIN, Roles.OWNER, Roles.PILOT)
  // @UseGuards(RolesGuard)
  // @Get('get-all')
  // async findAll(@Loggeduser() loggedUser: any) {
  //   return await this.usersService.findAll(loggedUser);
  // }



  // @Post('email')
  // findOneByEmail(@Body() data: {email: string}) {
  //   return this.usersService.findOneByEmail(data.email);
  // }

  // @Get(':id')
  // findOneById(@Param('id') id: string) {
  //   return this.usersService.findOneById(+id);
  // }



  

  // @Post(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
