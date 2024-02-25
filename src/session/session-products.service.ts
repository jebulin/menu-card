import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Session } from "./entities/session.entity";
import { CreateSessionProductDto } from "./dto/create-session-product.dto";
import { SessionProduct } from "./entities/session-products.entity";
import { UpdateSessionProductDto } from "./dto/update-session-product.dto";

@Injectable()
export class SessionProductService {
    constructor(@InjectRepository(SessionProduct)
    private readonly sessionProductRepository: Repository<SessionProduct>) { }

    async create(createSessionProduct: CreateSessionProductDto, loggedUser: any) {
        try {
            let existingData = await this.sessionProductRepository.findOne({
                where: {
                    shopId: loggedUser.shopInfo.shopId,
                    sessionId: createSessionProduct.sessionId,
                    productId: createSessionProduct.productId
                }
            });

            if (existingData)
                throw { message: "Session Product already exists", statusCode: 409 };

            createSessionProduct.createdBy = loggedUser.id;
            createSessionProduct.shopId = loggedUser.shopInfo.shopId;
            await this.sessionProductRepository.save(createSessionProduct)

            return "Session product is created successfully"
        } catch (err) {
            console.log("Error in session Product creation ", err);
            if (err?.statusCode)
                throw { message: err.message, statusCode: err.statusCode }
            else
                throw { message: "Error while creating session product", statusCode: 500 }
        }

    }


    async update(updateSessionProduct: UpdateSessionProductDto, loggedUser: any){
        try {
            let existingData = await this.sessionProductRepository.findOne({
                where: {
                    shopId: loggedUser.shopInfo.shopId,
                    sessionId: updateSessionProduct.sessionId,
                    productId: updateSessionProduct.productId
                }
            });

            if (!existingData)
                throw { message: "Session Product not present", statusCode: 404 };

            updateSessionProduct.updatedBy = loggedUser.id;
            updateSessionProduct.status = updateSessionProduct.status;
            await this.sessionProductRepository.save(existingData)

            return "Session product is updated successfully"
        } catch (err) {
            console.log("Error in session Product updation ", err);
            if (err?.statusCode)
                throw { message: err.message, statusCode: err.statusCode }
            else
                throw { message: "Error while updating session product", statusCode: 500 }
        }
    }
}