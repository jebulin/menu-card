import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags, ApiHeader, ApiBearerAuth, ApiUnauthorizedResponse, ApiOkResponse, ApiNotFoundResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guard/jwt.guard';
import { RequestInterceptor } from 'src/shared/interceptors/request.interceptor';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesAllowed } from 'src/auth/Decorator/roles.decorator';
import { Roles } from 'src/shared/roles.enum';
import { Loggeduser } from 'src/auth/Decorator/loggeduser.decorator';

@Controller('products')
@ApiTags('Product')
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
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @RolesAllowed(Roles.SUPER_ADMIN, Roles.OWNER, Roles.PILOT)
  @Post("create")
  async create(@Body() createProductDto: CreateProductDto, @Loggeduser() loggedUser:any) {
    return await this.productsService.create(createProductDto, loggedUser);
  }

  @Post('update')
  async update(@Body() updateProductDto: UpdateProductDto, @Loggeduser() loggedUser:any) {
    return await this.productsService.update(updateProductDto, loggedUser);
  }

  @Get('getall')
  async findAll(@Loggeduser() loggedUser:any) {
    return await this.productsService.findAll(loggedUser);
  }

  @Get('get/:id')
  findOne(@Param('id') id: string, loggedUser:any) {
    return this.productsService.findOne(+id);
  }

  

  @Delete('delete/:id')
  remove(@Param('id') id: string, @Loggeduser() loggedUser:any) {
    return this.productsService.remove(+id, loggedUser);
  }
}
