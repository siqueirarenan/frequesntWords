import { config } from 'dotenv';

export default () => ({
  // Here we try to get the environment variables from different sources,
  // since locally works differently than in the server
  database: {
    type: (process.env.DATABASE_TYPE ?? config().parsed?.DATABASE_TYPE) as
      | 'mysql'
      | 'mariadb'
      | 'postgres'
      | 'mssql'
      | 'sqlite',
    host: process.env.DATABASE_HOST ?? config().parsed?.DATABASE_HOST,
    port:
      parseInt(process.env.DATABASE_PORT ?? config().parsed?.DATABASE_PORT) ||
      3306,
    username:
      process.env.DATABASE_USERNAME ?? config().parsed?.DATABASE_USERNAME,
    password:
      process.env.DATABASE_PASSWORD ?? config().parsed?.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME ?? config().parsed?.DATABASE_NAME,
    schema: process.env.DATABASE_SCHEMA ?? config().parsed?.DATABASE_SCHEMA,
  },
});
