import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class CliService {
  private readonly logger = new Logger(CliService.name)

  constructor(
    private configService: ConfigService,
  ) {
    //
  }

  public help() {
    this.logger.log('OK')
  }
}
