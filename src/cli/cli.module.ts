import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { EmailsModule } from '../emails/emails.module'
import { CliService } from './cli.service'

@Module({
  imports: [
    ConfigModule,
    EmailsModule,
  ],
  providers: [CliService]
})
export class CliModule {
  //
}
