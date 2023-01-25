import { NestFactory } from '@nestjs/core'
import * as process from 'process'

import { AppModule } from './app.module'
import { CliService } from './cli/cli.service'

async function bootstrap() {
  switch (process.env.AGRV) {
  case 'consumeEmailReceivedEvents':
    await consumeEmailReceivedEventsCommand()
    break

  case 'serve':
    await serveCommand()
    break

  default:
    await helpCommand()
  }
}

bootstrap()

async function helpCommand(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule)

  const service = app.get<CliService>(CliService)
  await service.helpCommand()

  await app.close()
}

async function consumeEmailReceivedEventsCommand(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule)

  const service = app.get<CliService>(CliService)
  await service.consumeEmailReceivedEventsCommand()

  await app.close()
}

async function serveCommand(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.port || 3000)
}
