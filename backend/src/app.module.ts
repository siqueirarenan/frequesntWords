import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../config/config';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { DatabaseModule } from './_database/database.module';
import { LanguageModule } from './languages/language.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransactionInterceptor } from './_common/interceptors/transaction.interceptor';
import { LogInterceptor } from './_common/interceptors/log.interceptor';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { UserKnowlegeModule } from './userKnowleges/userKnowlege.module';
import { WordModule } from './words/word.module';
import { CustomJwtModule } from './auth/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      errorHandler: {
        handle(e) {
          if (process.env.NODE_ENV === 'development') console.log(e);
        },
      },
    }),
    EventEmitterModule.forRoot(),
    DatabaseModule, //The order here matters in the route resolution
    CustomJwtModule,
    AuthModule,
    LanguageModule,
    UserModule,
    UserKnowlegeModule,
    WordModule,
  ],
  providers: [
    //The order of the inteceptors matter
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
})
export class AppModule {}
