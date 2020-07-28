import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const {GPM_BURL, GPM_URL} = require('../../config/config');

const config = {
  name: 'gpm',
  connector: 'rest',
  baseURL: GPM_BURL,
  crud: false,
  strictSSL: false,
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
  },
  operations: [{
    template: {
      method: 'GET',
      url: GPM_URL,
      query: "{args}"
    },
    functions: {
      getProductionData: ["args"]
    }
  }]
};

@lifeCycleObserver('datasource')
export class GpmDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'gpm';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.gpm', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
