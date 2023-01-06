import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/sequelize'

import { EmailsController } from './emails.controller'
import { EmailsService } from './emails.service'
import { Email } from './models/email.model'

describe('EmailsController', () => {
  let controller: EmailsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ EmailsController],
      providers: [
        EmailsService,
        {
          provide: getModelToken(Email),
          useValue: {},
        }
      ]
    }).compile()

    controller = module.get<EmailsController>(EmailsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
