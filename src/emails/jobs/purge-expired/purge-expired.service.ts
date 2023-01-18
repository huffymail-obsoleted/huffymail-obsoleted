import { Injectable } from '@nestjs/common'
import { EmailsService } from '../../emails.service'
import { Op } from 'sequelize'

@Injectable()
export class PurgeExpiredService {
  constructor(
    private readonly emailsService: EmailsService
  ) {}

  public async process() {
    await this.emailsService.destroy({
      where: {
        createdAt: {
          [Op.lte]: (new Date()).getDate() - 5
        }
      }
    })
  }
}
