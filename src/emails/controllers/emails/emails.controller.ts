import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import * as Joi from 'joi'
import { Attributes, FindOptions, Op } from 'sequelize'

import { Email } from '../../models/email.model'
import { EmailsService } from '../../services/emails/emails.service'

@Controller('/api/emails')
export class EmailsController {
  constructor(
    private readonly emailsService: EmailsService
  ) {
    //
  }

  @Get()
  async findAll(
    @Query() query
  ): Promise<any> {
    const schema = Joi.object({
      to: Joi.string()
        .email()
        .required(),

      limit: Joi.number()
        .min(1)
        .max(100)
        .required(),

      offset: Joi.number()
        .min(0)
    })

    const { value, error } = schema.validate(query)
    if (error) {
      throw new BadRequestException(error.message)
    }

    const options: FindOptions<Attributes<Email>> = {
      attributes: {
        exclude: ['id', 'html']
      },
      where: {
        [Op.and]: [
          { to: value.to }
        ]
      },
      limit: value.limit,
      offset: value.offset,
      order: [
        ['id', 'DESC']
      ]
    }

    return this.emailsService.findAll(options)
  }

  @Get(':messageId')
  async findOne(
    @Param() param
  ): Promise<Email | null> {
    const schema = Joi.object({
      messageId: Joi.string()
        .alphanum()
        .min(40)
        .required()
    })

    const { value, error } = schema.validate(param)
    if (error) {
      throw new BadRequestException(error.message)
    }

    const options: FindOptions<Attributes<Email>> = {
      attributes: {
        exclude: ['id']
      },
      where: {
        messageId: value.messageId
      }
    }

    const record = await this.emailsService.findOne(options)
    if (record === null) {
      throw new NotFoundException()
    }

    return record
  }
}
