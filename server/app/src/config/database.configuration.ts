import entities from '../models';
import configuration from './configuration';
import { ConnectionOptions } from 'typeorm';

const { database } = configuration;
const { host, port, name, username, password, synchronize } = database;

const dbConfig: ConnectionOptions = {
  type: 'postgres',
  host,
  port,
  username,
  password,
  database: name,
  uuidExtension: 'uuid-ossp',
  synchronize,
  entities,
  cache: false,
};

export default dbConfig;
