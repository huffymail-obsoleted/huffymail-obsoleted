import { Test, TestingModule } from '@nestjs/testing'
import { SesService } from './ses.service'
import { ConfigModule } from '@nestjs/config'
import { S3Service } from './s3/s3.service'

describe('SesService', () => {
  let service: SesService
  let s3Service: S3Service

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        SesService,
        S3Service
      ],
    }).compile()

    service = module.get<SesService>(SesService)
    s3Service = module.get<S3Service>(S3Service)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
