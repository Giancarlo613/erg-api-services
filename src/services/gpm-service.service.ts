import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {GpmDataSource} from '../datasources';

export interface GetProductionDataRequest {
  user: string,
  password: string
}

export interface GetProductionDataResponse {
  upName: string,
  unixdate: number,
  MW: number,
  QoS: number
}

export interface GpmService {
  getProductionData(args: GetProductionDataRequest): Promise<GetProductionDataResponse[]>;
}

export class GpmServiceProvider implements Provider<GpmService> {
  constructor(
    @inject('datasources.gpm')
    protected dataSource: GpmDataSource = new GpmDataSource(),
  ) {}

  value(): Promise<GpmService> {
    return getService(this.dataSource);
  }
}
