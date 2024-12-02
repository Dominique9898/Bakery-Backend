import { DataSource } from 'typeorm';
import config from './index';
const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.dbHost,
  port: config.dbPort,
  username: config.dbUser,
  password: config.dbPassword,
  database: config.dbName,
  entities: [__dirname + '/../models/*.ts'],
  migrations: [__dirname + '/../migrations/*.ts'],
});

export default AppDataSource;