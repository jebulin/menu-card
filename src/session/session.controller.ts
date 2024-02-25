import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { Loggeduser } from 'src/auth/Decorator/loggeduser.decorator';
import { ApiTags, ApiHeader, ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/shared/guard/jwt.guard';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptor';
import { RolesAllowed } from 'src/auth/Decorator/roles.decorator';
import { Roles } from 'src/shared/roles.enum';
import { SessionProductService } from './session-products.service';
import { CreateSessionProductDto } from './dto/create-session-product.dto';
import { UpdateSessionProductDto } from './dto/update-session-product.dto';

@Controller('session')
@ApiTags('Session')
@ApiHeader({
  name: 'X-Shop-Id',
  description: 'Shop ID'
})
@ApiBearerAuth()
@ApiUnauthorizedResponse()
@ApiOkResponse()
@ApiNotFoundResponse()
@ApiInternalServerErrorResponse()
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(RequestInterceptor)
export class SessionController {
  constructor(private readonly sessionService: SessionService,
    private readonly sessionProductService: SessionProductService) { }

  @RolesAllowed(Roles.SUPER_ADMIN, Roles.OWNER, Roles.PILOT, Roles.CO_PILOT)
  @Post('create')
  async create(@Body() createSessionDto: CreateSessionDto, @Loggeduser() loggedUser: any) {
    return await this.sessionService.create(createSessionDto, loggedUser);
  }

  @RolesAllowed(Roles.SUPER_ADMIN, Roles.OWNER, Roles.PILOT, Roles.CO_PILOT)
  @Get()
  async findAll(@Loggeduser() loggedUser: any) {
    return await this.sessionService.findAllShopSessions(loggedUser);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Loggeduser() loggedUser: any) {
    return await this.sessionService.findOne(+id, loggedUser);
  }
  
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
  //   return this.sessionService.update(+id, updateSessionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.sessionService.remove(+id);
  // }

  @Post('create-session-product')
  async createSessionProduct(@Body() createSessionProduct: CreateSessionProductDto, @Loggeduser() loggedUser: any) {
    return await this.sessionProductService.create(createSessionProduct, loggedUser);
  }

  @Post('update-session-product')
  async updateSessionProduct(@Body() updateSessionProduct: UpdateSessionProductDto, @Loggeduser() loggedUser: any) {
    return await this.sessionProductService.update(updateSessionProduct, loggedUser);
  }

  
}
