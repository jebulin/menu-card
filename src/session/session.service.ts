import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
import { STATUS } from 'src/shared/status.enum';

@Injectable()
export class SessionService {
  constructor(@InjectRepository(Session)
  private readonly sessionRepository: Repository<Session>) { }


  async create(createSessionDto: CreateSessionDto, loggedUser: any) {
    console.log(loggedUser)
    try {
      let existingNames = await this.sessionRepository.findOne({ where: { name: createSessionDto.name, shopId: loggedUser.shopInfo.shopId } })

      if (existingNames) {
        throw { message: "Menu name already present", statusCode: 409 }
      }

      let activeSessions = await this.sessionRepository.find({ where: { shopId: loggedUser.shopInfo.shopId, status: STATUS.Active } });

      if (activeSessions) {
        let [startTimeEnteredHr, startTimeEnteredMin] = createSessionDto.startTime.split(':');
        let [endTimeEnteredHr, endTimeEnteredMin] = createSessionDto.endTime.split(':');
        for (let activeSession of activeSessions) {

          let [startTimeInDbHr, startTimeInDbMin] = activeSession.startTime.split(":");
          let [endTimeInDbHr, endTimeInDbMin] = activeSession.endTime.split(":");

          if (Number(startTimeEnteredHr) > Number(startTimeInDbHr) || (Number(startTimeEnteredHr) === Number(startTimeInDbHr) && Number(startTimeEnteredMin) >= 0)) {
            if (Number(startTimeEnteredHr) < Number(endTimeInDbHr) || (Number(startTimeEnteredHr) === Number(endTimeInDbHr) && Number(startTimeEnteredMin) <= 0)) {
              throw { message: "Seesion Time overlaps with other session", statusCode: 500 }
            }
          }

        }

      }

      createSessionDto.shopId = loggedUser.shopInfo.shopId;
      createSessionDto.createdBy = loggedUser.id;
      return await this.sessionRepository.save(createSessionDto);
    } catch (err) {
      console.log("Error in session creation ", err);
      if (err?.statusCode)
        throw { message: err.message, statusCode: err.statusCode }
      else
        throw { message: "Error while creating session", statusCode: 500 }
    }
  }



  async findAllShopSessions(loggedUser:any) {
    return await this.sessionRepository.find({where: {shopId: loggedUser.shopInfo.shopId}});
  }

  async findOne(id: number, loggedUser:any) {
    return await this.sessionRepository.find({where: {shopId: loggedUser.shopInfo.shopId , id: id}});
  }

  // update(id: number, updateSessionDto: UpdateSessionDto) {
  //   return `This action updates a #${id} session`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} session`;
  // }
}
