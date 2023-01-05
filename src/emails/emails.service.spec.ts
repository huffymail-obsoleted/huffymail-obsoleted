import { Test, TestingModule } from '@nestjs/testing'
import { EmailsService } from './emails.service'
import { getModelToken } from '@nestjs/sequelize'

import { Email } from './models/email.model'

describe('EmailsService', () => {
  let service: EmailsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailsService,
        {
          provide: getModelToken(Email),
          useValue: {
            create: jest.fn((values) => values)
          },
        }
      ],
    }).compile()

    service = module.get<EmailsService>(EmailsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('create', () => {
    it('should returns', async () => {
      const actual = await service.create({
        id: 1
      })

      expect(actual).not.toBeUndefined()
    })
  })
})
