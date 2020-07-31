import {Entity, model, property} from '@loopback/repository';

@model({
  schema: 'stage',
  name: 'Power_ERG_Curve_Consuntive'
})
export class PowerErgCurveConsuntive extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  etlInsertAuditId?: number;

  @property({
    type: 'number',
  })
  dateId?: number;

  @property({
    type: 'string',
  })
  upCod?: string;

  @property({
    type: 'string',
  })
  upName?: string;

  @property({
    type: 'date',
  })
  data?: string;

  @property({
    type: 'number',
  })
  ora?: number;

  @property({
    type: 'number',
  })
  quartoOra?: number;

  @property({
    type: 'number',
  })
  eea?: number;

  @property({
    type: 'number',
  })
  eua?: number;

  @property({
    type: 'string',
  })
  tecnologia?: string;

  @property({
    type: 'string',
  })
  zona?: string;

  @property({
    type: 'string',
  })
  macrozona?: string;


  constructor(data?: Partial<PowerErgCurveConsuntive>) {
    super(data);
  }
}

export interface PowerErgCurveConsuntiveRelations {
  // describe navigational properties here
}

export type PowerErgCurveConsuntiveWithRelations = PowerErgCurveConsuntive & PowerErgCurveConsuntiveRelations;
