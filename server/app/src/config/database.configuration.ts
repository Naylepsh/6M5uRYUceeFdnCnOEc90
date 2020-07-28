import entities from '../models';
import configuration from './configuration';
import { ConnectionOptions } from 'typeorm';

const { database } = configuration;
const { host, port, name, username, password } = database;
console.log(host, port, name, username, password);
const dbConfig: ConnectionOptions = {
  type: 'postgres',
  host,
  port,
  username,
  password,
  database: name,
  uuidExtension: 'uuid-ossp',
  synchronize: true,
  entities,
};

export default dbConfig;
