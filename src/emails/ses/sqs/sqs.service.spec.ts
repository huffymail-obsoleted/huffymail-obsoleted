import { Test, TestingModule } from '@nestjs/testing'
import { SqsService } from './sqs.service'
import { ConfigModule } from '@nestjs/config'

import { SesService } from '../ses.service'
import { S3Service } from '../s3/s3.service'

describe('SqsService', () => {
  let service: SqsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        SqsService,
        SesService,
        S3Service,
      ],
    }).compile()

    service = module.get<SqsService>(SqsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
