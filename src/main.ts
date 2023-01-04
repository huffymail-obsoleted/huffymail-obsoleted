import { NestFactory } from '@nestjs/core'
import * as process from 'process'

import { AppModule } from './app.module'
import { SesService } from './emails/ses/ses.service'

async function bootstrap() {
  switch (process.env.AGRV) {
  case 'emails:ses':
    await emailsSQSCommand()
    break

  default:
    await serveCommand()
  }
}

bootstrap()

async function emailsSQSCommand(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule)

  const sesService = app.get<SesService>(SesService)
  sesService.consume()

  await app.close()
}

async function serveCommand(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}
