import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EmailsService } from './emails.service'
import { SesService } from './ses/ses.service'
import { S3Service } from './ses/s3/s3.service'
import { SqsService } from './ses/sqs/sqs.service';

@Module({
  imports: [ConfigModule],
  providers: [
    EmailsService,
    SesService,
    S3Service,
    SqsService
  ]
})
export class EmailsModule {}
