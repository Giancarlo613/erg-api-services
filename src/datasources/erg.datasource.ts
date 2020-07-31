import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const {DB_HOST, DB_USER, DB_PWD, DB_NAME, DB_TABLE} = require('../../config/config');

const config = {
  name: 'erg',
  connector: 'mssql',
  host: DB_HOST,
  port: 1433,
  user: DB_USER,
  password: DB_PWD,
  database: DB_NAME,
  table: DB_TABLE,
  options: {
    encrypt: true
  }
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class ErgDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'erg';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.erg', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
