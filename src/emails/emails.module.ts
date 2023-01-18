import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { EmailsService } from './emails.service'
import { SesService } from './ses/ses.service'
import { S3Service } from './ses/s3/s3.service'
import { SqsService } from './ses/sqs/sqs.service'
import { EmailsController } from './emails.controller'

import { Email } from './models/email.model'
import { PurgeExpiredService } from './jobs/purge-expired/purge-expired.service';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([Email])
  ],
  providers: [
    EmailsService,
    SesService,
    S3Service,
    SqsService,
    PurgeExpiredService
  ],
  controllers: [EmailsController]
})
export class EmailsModule {}
