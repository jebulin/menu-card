import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { Repository } from 'typeorm';
import { ShopUsers } from 'src/shared/entities/shop-users.entity';
import { UrlNameDTO } from './dto/update-urlName.dto';
import { VerifyUrlNameDto } from './dto/verify-urlname.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop) private readonly shopRepository: Repository<Shop>) { }

  // async findAll(loggedUser) {
  //   let shops = await this.shopRepository.find();
  //   return shops;
  // }

  // async findOne(id: number) {
  //   let shop = await this.shopRepository.findOne({ where: { id: id } });
  //   return shop;
  // }

  async findOneByUrlName(name: string, loggedUser = null) {
    try {
      let shop = await this.shopRepository.findOne({ where: { urlName: name } });
      return shop;
    } catch (err) {
      console.log(err)
      throw new HttpException("Shop find error", 404);
    }
  }

  async verifyUrlName(verifyUrlName: VerifyUrlNameDto, loggedUser = null) {
    let urlNamePresent = await this.findOneByUrlName(verifyUrlName.urlName);
    if (urlNamePresent) {
      throw new NotFoundException("Urlname already taken");
    }
    return { data: "available", statuCode: 200 };
  }

  async changeUrlname(udpateUrlname: VerifyUrlNameDto, loggedUser) {
    try {
      await this.verifyUrlName(udpateUrlname);
      let saveShopurlName: Partial<Shop> = {
        urlName: udpateUrlname.urlName,
        updatedBy: loggedUser.id
      }
      await this.shopRepository.update(loggedUser.shopInfo.shopId, saveShopurlName)
      return "Url name changed successfully";
    } catch (err) {
      console.log("Error in change url name", err);
      throw { message: err.message, statusCode: err.statusCode }
    }
  }


  async create(createShopDto: CreateShopDto, loggedUser) {
    try {
      let verifyUrlName: VerifyUrlNameDto = { urlName: createShopDto.urlName }
      let shopPresent = await this.verifyUrlName(verifyUrlName);

      createShopDto.createdBy = loggedUser.id
      let shop = await this.shopRepository.save(createShopDto);

      return shop;

    } catch (err) {
      console.log("Error in create shop: ", err);
      throw { message: err.message, statusCode: err.statusCode }
    }
  }


  async update(updateShopDto: UpdateShopDto, loggedUser: any) {
    try {
      delete updateShopDto.urlName

      let shop = await this.shopRepository.findOneOrFail({ where: { id: loggedUser.shopInfo.shopId } });
      updateShopDto.updatedBy = loggedUser.id;
      this.shopRepository.merge(shop, updateShopDto);
      shop = await this.shopRepository.save(shop);

      return shop;
    } catch (err) {
      console.log("Error in update shop: ", err)
      throw { message: "Error in update shop", statusCode: 500 }
    }
  }

  async remove(id: number, loggedUser: any) {
    try {
      let shop = await this.shopRepository.findOneOrFail({ where: { id: id, status: 1 } });
      shop.status = 3;
      shop.updatedBy = loggedUser.id;
      await this.shopRepository.save(shop);
      return "Shop Deleted";
    } catch (err) {
      console.log("Error in delete ", err);
      throw { message: "Error in delete shop", statusCode: 500 }
    }
  }

}
