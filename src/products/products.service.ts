import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Roles } from 'src/shared/roles.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto, loggedUser: any) {

    await this.findOneByName(createProductDto.name, loggedUser);
    createProductDto.createdBy = loggedUser.id;
    createProductDto.shopId = loggedUser.shopInfo.shopId
    await this.productsRepository.save(createProductDto)
    return "Product saved successfully";

  }

  async findOneByName(name: string, loggedUser: any) {
    try {
      let product = await this.productsRepository.findOne({ where: { name: name, shopId: loggedUser.shopInfo.shopId } })
      if (!product)
        return "Product Name is not present";

      throw { message: "Product name is present in db", statusCode: 404 };
    } catch (err) {
      console.log(err);
      throw { message: err.message, statusCode: err.statusCode };
    }
  }

  async update(updateProductDto: UpdateProductDto, loggedUser: any) {

    let product = await this.findOne(updateProductDto.id);

    if (!product)
      throw { message: "Product is not present in db", statusCode: 404 };

    if (loggedUser.roleId.includes(Roles.CO_PILOT)) {// co pilot is alowed only to update stock
      let keys = Object.keys(updateProductDto);
      if (keys.length != 2 && !keys.includes('id') && !keys.includes('stock')) {
        throw { message: "Product is not present in db", statusCode: 404 };
      }
    }

    this.productsRepository.merge(product, updateProductDto);

    let savedProduct = await this.productsRepository.update(product.id, product);

    return savedProduct;
  }

  async findAll(loggedUser: any) {
    return await this.productsRepository.find({ where: { shopId: loggedUser.shopInfo.shopId } });
  }

  async findOne(id: number) {
    return await this.productsRepository.findOne({ where: { id: id } });
  }



  async remove(id: number, loggedUser: any) {
    let product = await this.findOne(id);
    if (!product) throw { message: "product not found", statusCode: 404 };

    product.updatedBy = loggedUser.id;
    product.status = 3;

    await this.productsRepository.update(id, product)
    return `Product removed succesfully`;
  }
}
