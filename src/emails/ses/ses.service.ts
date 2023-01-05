import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Message } from '@aws-sdk/client-sqs'
import { get } from 'lodash'
import { simpleParser } from 'mailparser'

import { S3Service } from './s3/s3.service'

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
  constructor(
    private configService: ConfigService,
    private s3Service: S3Service,
  ) {}

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

    const objectAsString = await this.s3Service.getObjectAsString(message.mail?.messageId)
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
}
