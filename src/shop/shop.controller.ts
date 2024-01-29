import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesAllowed } from 'src/auth/Decorator/roles.decorator';
import { Roles } from 'src/shared/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UrlNameDTO } from './dto/update-urlName.dto';
import { ApiBearerAuth, ApiHeader, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptor';
import { JwtAuthGuard } from 'src/shared/guard/jwt.guard';
import { Loggeduser } from 'src/auth/Decorator/loggeduser.decorator';
import { VerifyUrlNameDto } from './dto/verify-urlname.dto';

@Controller('shop')
@ApiTags('Shop')
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
@UseGuards(JwtAuthGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) { }

  @RolesAllowed(Roles.SUPER_ADMIN, Roles.OWNER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Verify Url Name' })
  @Post("check-url-name")
  async verifyUrlName(@Body() verifyUrlName: VerifyUrlNameDto, @Loggeduser() Loggeduser: any) {
    return await this.shopService.verifyUrlName(verifyUrlName)
  }

  @RolesAllowed(Roles.SUPER_ADMIN, Roles.OWNER)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Change Url Name' })
  @Post("change-url-name")
  async changeUrlName(@Body() changeUrlname: VerifyUrlNameDto, @Loggeduser() loggeduser: any) {
    return await this.shopService.changeUrlname(changeUrlname, loggeduser)
  }


  @RolesAllowed(Roles.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create Shop' })
  @Post('create')
  async create(@Body() createShopDto: CreateShopDto, @Loggeduser() Loggeduser: any) {
    return await this.shopService.create(createShopDto, Loggeduser);
  }



  // @Get()
  // async findAll(@Request() req: any) {
  //   return this.shopService.findAll(req.user);
  // }

  // @Get(':id')
  // async findOne(@Param('id') id: string) {
  //   return this.shopService.findOne(+id);
  // }

  @Post('update')
  update(@Body() updateShopDto: UpdateShopDto, @Loggeduser() loggeduser: any) {
    return this.shopService.update(updateShopDto, loggeduser);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Loggeduser() loggeduser: any) {
    return this.shopService.remove(+id, loggeduser);
  }

  // @Post('change-url-name')
  // changeUrlName(@Body() urlNameDto: UrlNameDTO, @Request() req: any) {
  //   return this.shopService.changeUrlName(urlNameDto, req.user);
  // }
}
