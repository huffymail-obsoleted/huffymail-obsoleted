import { Message, SQSClient } from '@aws-sdk/client-sqs'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Consumer } from 'sqs-consumer'

import { SesService } from '../emails/services/ses/ses.service'

@Injectable()
export class CliService {
  private readonly logger = new Logger(CliService.name)

  constructor(
    private configService: ConfigService,
    private sesService: SesService
  ) {
    //
  }

  public helpCommand() {
    this.logger.log('OK')
  }

  public emailsConsumeCommand(): Promise<void> {
    return new Promise(resolve => {
      const consumer = Consumer.create({
        queueUrl: this.configService.get<string>('AWS_SES_QUEUE_URL'),
        sqs: new SQSClient({
          region: this.configService.get<string>('AWS_SES_REGION')
        }),
        handleMessage: async (message: Message): Promise<void> => {
          return this.sesService.handleMessage(message)
        }
      })

      consumer.on('error', error => {
        this.logger.error(`sqs-consumer fired an "error" event: ${error.message}`, {
          error: error
        })
      })

      consumer.on('processing_error', error => {
        this.logger.error(`sqs-consumer fired a "processing_error" event: ${error.message}`, {
          error: error
        })
      })

      consumer.on('stopped', resolve)

      consumer.start()
    })
  }
}
