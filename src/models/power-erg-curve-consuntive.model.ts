import {Entity, model, property} from '@loopback/repository';

@model({
  schema: 'stage',
  name: 'Power_ERG_Curve_Consuntive'
})
export class PowerErgCurveConsuntive extends Entity {

  @property({
    name: 'DateId',
    id: true,
    generated: true,
    type: 'number'
  })
  dateId?: number;

  @property({
    name: 'UP_Cod',
    type: 'string'
  })
  upCod?: string;

  @property({
    name: 'UP_Name',
    type: 'string'
  })
  upName?: string;

  @property({
    name: 'Data',
    type: 'date'
  })
  data?: string;

  @property({
    name: 'Ora',
    type: 'number'
  })
  ora?: number;

  @property({
    name: 'QuartoOra',
    type: 'number'
  })
  quartoOra?: number;

  @property({
    name: 'EEA',
    type: 'number'
  })
  eea?: number;

  @property({
    name: 'EUA',
    type: 'number'
  })
  eua?: number;

  @property({
    name: 'Tecnologia',
    type: 'string'
  })
  tecnologia?: string;

  @property({
    name: 'Zona',
    type: 'string'
  })
  zona?: string;

  @property({
    name: 'Macrozona',
    type: 'string'
  })
  macrozona?: string;

  @property({
    name: 'etl_insert_audit_id',
    type: 'number',
  })
  etlInsertAuditId?: number;

  constructor(data?: Partial<PowerErgCurveConsuntive>) {
    super(data);
  }
}

export interface PowerErgCurveConsuntiveRelations {
  // describe navigational properties here
}

export type PowerErgCurveConsuntiveWithRelations = PowerErgCurveConsuntive & PowerErgCurveConsuntiveRelations;
