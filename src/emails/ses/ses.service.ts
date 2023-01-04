import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Consumer } from 'sqs-consumer'
import { Message, SQSClient } from '@aws-sdk/client-sqs'
import { get } from 'lodash'
import { simpleParser } from 'mailparser'

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

declare type ParseMessageResult = {
  messageId: string
  from: string
  to: string
  spamVerdict: boolean
  virusVerdict: boolean
  content: {
    html: any | string
    subject: any | string
    date: any | string
  }
}

@Injectable()
export class SesService {
  private s3: S3Client = new S3Client({
    region: this.configService.get<string>('AWS_SES_REGION')
  })

  private sqs: SQSClient = new SQSClient({
    region: this.configService.get<string>('AWS_SES_REGION')
  })

  constructor(private configService: ConfigService) {}

  public consume() {
    const consumer = Consumer.create({
      queueUrl: this.configService.get<string>('AWS_SES_QUEUE_URL'),
      sqs: this.sqs,
      handleMessage: async (message: Message): Promise<void> => {
        return this.handleMessage(message)
      }
    })

    consumer.on('error', console.error)
    consumer.on('processing_error', console.error)

    consumer.start()
  }

  public async handleMessage(message: Message): Promise<void> {
    const bodyAsString = message.Body
    if (bodyAsString === undefined) {
      throw new Error('bodyAsString is undefined')
    }

    const result = await this.parseMessage(bodyAsString)
    if (result === undefined) {
      throw new Error('result is undefined')
    }

    console.log(result)

    return
  }

  public async parseMessage(bodyAsString: string): Promise<ParseMessageResult | undefined> {
    const body = JSON.parse(bodyAsString)

    const messageAsString = body.Message
    if (messageAsString === undefined) {
      throw new Error('body.Message is undefined')
    }

    const message = JSON.parse(messageAsString)

    const objectAsString = await this.getObjectAsString(message.mail?.messageId)
    if (objectAsString === undefined) {
      throw new Error('object is undefined')
    }

    const object = await simpleParser(objectAsString)

    return {
      messageId: get(message, 'mail.messageId'),
      from: get(message, 'mail.source'),
      to: get(message, 'mail.destination.0'),
      spamVerdict: get(message, 'receipt.spamVerdict.status') === 'PASS',
      virusVerdict: get(message, 'receipt.virusVerdict.status') === 'PASS',
      content: {
        html: get(object, 'html'),
        subject: get(object, 'subject'),
        date: get(object, 'date')
      }
    }
  }

  public async getObjectAsString(key: string): Promise<string | undefined> {
    const { Body } = await this.s3.send(
      new GetObjectCommand({
        Bucket: this.configService.get<string>('AWS_SES_BUCKET'),
        Key: key,
      }),
    )

    return Body?.transformToString()
  }
}
