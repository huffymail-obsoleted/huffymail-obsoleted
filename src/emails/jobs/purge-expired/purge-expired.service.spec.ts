import { Test, TestingModule } from '@nestjs/testing'

import { PurgeExpiredService } from './purge-expired.service'

describe('PurgeExpiredService', () => {
  let service: PurgeExpiredService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurgeExpiredService],
    }).compile()

    service = module.get<PurgeExpiredService>(PurgeExpiredService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
