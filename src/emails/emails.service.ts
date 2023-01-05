import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Attributes, CreateOptions, CreationAttributes } from 'sequelize'

import { Email } from './models/email.model'

@Injectable()
export class EmailsService {
  constructor(
    @InjectModel(Email)
    private emailModel: typeof Email
  ) {}

  public async create(
    values: CreationAttributes<Email>,
    options?: CreateOptions<Attributes<Email>>
  ): Promise<Email> {
    return this.emailModel.create<Email>(values, options)
  }
}
