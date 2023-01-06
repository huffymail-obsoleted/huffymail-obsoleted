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
            create: jest.fn((values) => values),
            findAll: jest.fn(() => []),
            findOne: jest.fn(() => Email)
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
      expect(await service.create({
        id: 1
      })).not.toBeUndefined()
    })
  })

  describe('findAll', () => {
    it('should returns', async () => {
      expect(await service.findAll()).not.toBeUndefined()
    })
  })

  describe('findOne', () => {
    it('should returns', async () => {
      expect(await service.findOne()).not.toBeUndefined()
    })
  })
})
