import { NestFactory } from '@nestjs/core'
import * as process from 'process'

import { AppModule } from './app.module'
import { SqsService } from './emails/ses/sqs/sqs.service'
import { CliService } from './cli/cli.service'

async function bootstrap() {
  switch (process.env.AGRV) {
  case 'help':
    await helpCommand()
    break

  case 'ses:consume':
    await sesConsumeCommand()
    break

  default:
    await serveCommand()
  }
}

bootstrap()

async function helpCommand(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule)

  const service = app.get<CliService>(CliService)
  await service.help()

  await app.close()
}

async function sesConsumeCommand(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule)

  const sqsService = app.get<SqsService>(SqsService)
  await sqsService.consume()

  await app.close()
}

async function serveCommand(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.port || 3000)
}
