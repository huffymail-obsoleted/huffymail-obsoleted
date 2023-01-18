import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { CliService } from './cli.service'

@Module({
  imports: [ConfigModule],
  providers: [CliService]
})
export class CliModule {
  //
}
