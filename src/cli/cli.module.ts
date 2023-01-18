import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { CliService } from './cli.service'
import { EmailsModule } from '../emails/emails.module'

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
