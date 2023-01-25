import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { Dialect } from 'sequelize/types/sequelize'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CliModule } from './cli/cli.module'
import { EmailsModule } from './emails/emails.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        dialect: configService.get<Dialect>('DATABASE_DIALECT', 'mysql'),
        uri: configService.get<string>('DATABASE_URI'),
        autoLoadModels: true,
        synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', false)
      }),
      inject: [ConfigService]
    }),
    EmailsModule,
    CliModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  //
}
