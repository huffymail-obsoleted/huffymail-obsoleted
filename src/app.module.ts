import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Dialect } from 'sequelize/types/sequelize'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { EmailsModule } from './emails/emails.module'
import { SequelizeModule } from '@nestjs/sequelize'
import { CliModule } from './cli/cli.module';

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
  providers: [AppService],
})
export class AppModule {}
