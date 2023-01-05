import { Test, TestingModule } from '@nestjs/testing'
import { SqsService } from './sqs.service'
import { ConfigModule } from '@nestjs/config'

import { SesService } from '../ses.service'
import { S3Service } from '../s3/s3.service'
import { EmailsService } from '../../emails.service'
import { getModelToken } from '@nestjs/sequelize'
import { Email } from '../../models/email.model'

describe('SqsService', () => {
  let service: SqsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        SqsService,
        SesService,
        EmailsService,
        S3Service,
        {
          provide: getModelToken(Email),
          useValue: {},
        }
      ],
    }).compile()

    service = module.get<SqsService>(SqsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
