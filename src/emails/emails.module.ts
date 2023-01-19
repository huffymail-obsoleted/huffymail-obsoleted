import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { EmailsService } from './emails.service'
import { SesService } from './ses/ses.service'
import { S3Service } from './ses/s3/s3.service'

import { Email } from './models/email.model'

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([Email])
  ],
  providers: [
    EmailsService,
    SesService,
    S3Service
  ],
  exports: [
    SesService
  ]
})
export class EmailsModule {
  //
}
