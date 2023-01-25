import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'

import { EmailsService } from './emails.service'
import { Email } from './models/email.model'
import { S3Service } from './services/s3/s3.service'
import { SesService } from './services/ses/ses.service'

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([Email])
  ],
  providers: [
    EmailsService,
    S3Service,
    SesService
  ],
  exports: [
    SesService
  ]
})
export class EmailsModule {
  //
}
