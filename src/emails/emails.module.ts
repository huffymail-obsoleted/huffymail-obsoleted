import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EmailsService } from './emails.service'
import { SesService } from './ses/ses.service'

@Module({
  imports: [ConfigModule],
  providers: [
    EmailsService,
    SesService
  ]
})
export class EmailsModule {}
