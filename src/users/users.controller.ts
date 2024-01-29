import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request,UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesAllowed } from 'src/auth/Decorator/roles.decorator';
import { Roles } from 'src/shared/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptor';
import { ResetPasswordDTO } from './dto/reset-password-dto';
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
@UseInterceptors(RequestInterceptor)
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiOkResponse()
@ApiNotFoundResponse()
@ApiInternalServerErrorResponse()
@UseGuards(JwtAuthGuard,RolesGuard)
@UseInterceptors(RequestInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @RolesAllowed(Roles.SUPER_ADMIN,Roles.OWNER,Roles.PILOT)
  @Post()
  async create(@Body() userDto: UserDto,@Loggeduser() loggedUser:any) {
    return await this.usersService.create(userDto, loggedUser);
  }

  // @Get()
  // async findAll(@Request() req:any) {
  //   return await this.usersService.findAll();
  // }

  // @RolesAllowed(Roles.CO_PILOT,Roles.SUPER_ADMIN, Roles.PILOT)
  // @Post('change-password')
  // async changePassword(@Body() resetPasswordDto:ResetPasswordDTO,  @Request() req:any) {
  //   return await this.usersService.changePassword(resetPasswordDto, req.user);
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
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Post(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
