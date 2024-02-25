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

  async findAll(status:number, loggedUser=null) {
    let shops = await this.shopRepository.find({where: {status:1}});
    return shops;
  }

  // async findOne(id: number) {
  //   let shop = await this.shopRepository.findOne({ where: { id: id } });
  //   return shop;
  // }

  async findOneByPayload(payload: any, loggedUser = null) {
    try {
      let shop = await this.shopRepository.findOne({ where: payload });
      return shop;
    } catch (err) {
      console.log("shop find one by payload ", err)
      throw new HttpException("Shop find error", 404);
    }
  }

  async verifyUrlName(verifyUrlName: VerifyUrlNameDto, loggedUser = null) {
    let urlNamePresent = await this.findOneByPayload({ urlName: verifyUrlName.urlName });
    if (urlNamePresent) {
      throw { message: "Urlname already taken", statusCoce: 500 };
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

      await this.verifyUrlName(verifyUrlName);//directly error is thrown so no need to hanlde

      //if gst is present same needs to be done 
      // if fssai is present same needs to be done like verify urlname

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
      //gst and fssai check
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
