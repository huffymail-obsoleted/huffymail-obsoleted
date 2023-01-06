import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Attributes, CreateOptions, CreationAttributes, FindOptions } from 'sequelize'

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

  public async findAll(options?: FindOptions<Attributes<Email>>): Promise<Email[]> {
    return this.emailModel.findAll(options)
  }

  public async findOne(options?: FindOptions<Attributes<Email>>): Promise<Email | null> {
    return this.emailModel.findOne(options)
  }
}
