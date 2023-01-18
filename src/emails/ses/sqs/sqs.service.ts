import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Consumer } from 'sqs-consumer'
import { Message, SQSClient } from '@aws-sdk/client-sqs'

import { SesService } from '../ses.service'
import { CloudWatchClient, ListMetricsCommand, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch'

@Injectable()
export class SqsService {
  private readonly logger = new Logger(SqsService.name)

  private sqs: SQSClient = new SQSClient({
    region: this.configService.get<string>('AWS_SES_REGION')
  })

  constructor(
    private configService: ConfigService,
    private sesService: SesService,
  ) {}

  public async consume(): Promise<void> {
    const client = new CloudWatchClient({
      region: process.env.AWS_SES_REGION
    })

    for (let i = 0; i < 100; i++) {
      await client.send(new PutMetricDataCommand({
        Namespace: 'Custom/Huffymail',
        MetricData: [
          {
            MetricName: 'EmailProcessedSuccessful',
            Value: 1,
            Dimensions: [
              {
                Name: 'abc',
                Value: '123'
              },
            ]
          },
        ]
      }))
    }

    return

    return new Promise(resolve => {
      const consumer = Consumer.create({
        queueUrl: this.configService.get<string>('AWS_SES_QUEUE_URL'),
        sqs: this.sqs,
        handleMessage: async (message: Message): Promise<void> => {
          return this.sesService.handleMessage(message)
        }
      })

      consumer.on('error', error => {
        this.logger.error(`sqs-consumer fired an "error" event: ${error.message}`, {
          error: error,
        })
      })

      consumer.on('processing_error', error => {
        this.logger.error(`sqs-consumer fired a "processing_error" event: ${error.message}`, {
          error: error,
        })
      })

      consumer.on('stopped', resolve)

      consumer.start()
    })
  }
}
