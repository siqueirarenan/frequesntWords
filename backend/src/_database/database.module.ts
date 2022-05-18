import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../../config/config';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: config().database.type,
      host: config().database.host,
      port: config().database.port,
      username: config().database.username,
      password: config().database.password,
      database: config().database.name,
      schema: config().database.schema,
      autoLoadEntities: true,
      logging: process.env.NODE_ENV == 'development' ? true : false,
    }),
  ],
})
export class DatabaseModule {}

// Duplication of configuration is necessary here for migrations with TypeORM-CLI
export default new DataSource({
  type: 'postgres',
  host: config().database.host,
  port: config().database.port,
  username: config().database.username,
  password: config().database.password,
  database: config().database.name,
  schema: config().database.schema,
  entities: ['src/**/*.entity.ts'],
  synchronize: false,
  migrations: ['src/_database/migrations/*.ts'],
  migrationsTransactionMode: 'each',
});
