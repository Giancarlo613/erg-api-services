import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const {METE_URL, METE_WSDL} = require('../../config/config');

const config = {
  name: 'meteologica',
  connector: 'soap',
  url: METE_URL,
  wsdl: METE_WSDL,
  remotingEnabled: true,
  operations: {
    login: {
      service: 'MeteologicaDataExchangeServiceService',
      port: 'MeteologicaDataExchangeServicePort',
      operation: 'login'
    },
    logout: {
      service: 'MeteologicaDataExchangeServiceService',
      port: 'MeteologicaDataExchangeServicePort',
      operation: 'logout'
    },
    getAllFacilities: {
      service: 'MeteologicaDataExchangeServiceService',
      port: 'MeteologicaDataExchangeServicePort',
      operation: 'getAllFacilities'
    },
    getForecastMulti: {
      service: 'MeteologicaDataExchangeServiceService',
      port: 'MeteologicaDataExchangeServicePort',
      operation: 'getForecastMulti'
    },
    getForecast: {
      service: 'MeteologicaDataExchangeServiceService',
      port: 'MeteologicaDataExchangeServicePort',
      operation: 'getForecast'
    }
  }
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class MeteologicaDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'meteologica';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.meteologica', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
