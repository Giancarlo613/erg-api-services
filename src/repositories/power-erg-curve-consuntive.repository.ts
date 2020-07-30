import {DefaultCrudRepository} from '@loopback/repository';
import {PowerErgCurveConsuntive, PowerErgCurveConsuntiveRelations} from '../models';
import {ErgDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class PowerErgCurveConsuntiveRepository extends DefaultCrudRepository<
  PowerErgCurveConsuntive,
  typeof PowerErgCurveConsuntive.prototype.etlInsertAuditId,
  PowerErgCurveConsuntiveRelations
> {
  constructor(
    @inject('datasources.erg') dataSource: ErgDataSource,
  ) {
    super(PowerErgCurveConsuntive, dataSource);
  }
}
