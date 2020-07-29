import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'DmModel',
  connector: 'mssql',
  url: '',
  host: 'ergmodels.database.windows.net',
  port: 1433,
  user: 'pocapi',
  password: 'AZQwsx061',
  database: 'DM_Model_Pro'
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DmModelDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'DmModel';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.DmModel', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
