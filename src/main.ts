import { NestFactory } from '@nestjs/core'
import * as process from 'process'

import { AppModule } from './app.module'
import { SqsService } from './emails/ses/sqs/sqs.service'

async function bootstrap() {
  switch (process.env.AGRV) {
  case 'emails:ses':
    await emailsSESCommand()
    break

  default:
    await serveCommand()
  }
}

bootstrap()

async function emailsSESCommand(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule)

  const sqsService = app.get<SqsService>(SqsService)
  sqsService.consume()

  await app.close()
}

async function serveCommand(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}
