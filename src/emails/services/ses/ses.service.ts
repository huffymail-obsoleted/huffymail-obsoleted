import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Message } from '@aws-sdk/client-sqs'
import { ParsedMail, simpleParser } from 'mailparser'
import { get } from 'lodash'

import { S3Service } from './../s3/s3.service'
import { EmailsService } from '../../emails.service'

declare type ParsedMessage = {
  messageId: string
  from: string
  to: string
  spamVerdict: boolean
  virusVerdict: boolean
  subject: string | undefined
  html: string
  date: Date | undefined
}

@Injectable()
export class SesService {
  private readonly logger = new Logger(SesService.name)

  constructor(
    private configService: ConfigService,
    private emailsService: EmailsService,
    private s3Service: S3Service,
  ) {}

  public async handleMessage(message: Message): Promise<void> {
    const parsedMessage = await this.parseMessage(message)

    await this.emailsService.create({
      messageId: parsedMessage.messageId,
      from: parsedMessage.from,
      to: parsedMessage.to,
      spamVerdict: parsedMessage.spamVerdict,
      virusVerdict: parsedMessage.virusVerdict,
      subject: parsedMessage.subject,
      html: parsedMessage.html
    })

    this.logger.log(`A message has been consumed successfully: ${message.MessageId}`)

    return
  }

  public async parseMessage(message: Message): Promise<ParsedMessage | undefined> {
    const bodyAsString = message.Body
    if (bodyAsString === undefined) {
      throw new Error('bodyAsString is undefined')
    }

    const body = await this.parseMessageBody(bodyAsString)
    if (body === undefined) {
      throw new Error('body is undefined')
    }

    return body
  }

  public async parseMessageBody(bodyAsString: string): Promise<ParsedMessage | undefined> {
    const body = JSON.parse(bodyAsString)

    const messageAsString = body.Message
    if (messageAsString === undefined) {
      throw new Error('body.Message is undefined')
    }

    const message = JSON.parse(messageAsString)

    const mailAsString = await this.s3Service.getObjectAsString(message.mail?.messageId)
    if (mailAsString === undefined) {
      throw new Error('getObjectAsString returns undefined')
    }

    const mail = await this.parseMail(mailAsString)
    if (mail === undefined) {
      throw new Error('parseMail returns undefined')
    }

    return {
      messageId: get(message, 'mail.messageId'),
      from: get(message, 'mail.source'),
      to: get(message, 'mail.destination.0'),
      spamVerdict: get(message, 'receipt.spamVerdict.status') === 'PASS',
      virusVerdict: get(message, 'receipt.virusVerdict.status') === 'PASS',
      subject: mail.subject,
      html: mail.html as string,
      date: mail.date
    }
  }

  public async parseMail(asString: string): Promise<ParsedMail | undefined> {
    const parsedMail = await simpleParser(asString)
    if (parsedMail.html === false) {
      return undefined
    }

    return parsedMail
  }
}
