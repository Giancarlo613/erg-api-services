import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {PowerErgCurveConsuntive} from '../models';
import {PowerErgCurveConsuntiveRepository} from '../repositories';

export class CurveConsuntiveController {
  constructor(
    @repository(PowerErgCurveConsuntiveRepository)
    public powerErgCurveConsuntiveRepository: PowerErgCurveConsuntiveRepository,
  ) {}

  @get('/erg-api/v1/curve-consuntive/count', {
    responses: {
      '200': {
        description: 'PowerErgCurveConsuntive model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(PowerErgCurveConsuntive) where?: Where<PowerErgCurveConsuntive>,
  ): Promise<Count> {
    return this.powerErgCurveConsuntiveRepository.count(where);
  }

  @get('/erg-api/v1/curve-consuntive', {
    responses: {
      '200': {
        description: 'Array of PowerErgCurveConsuntive model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(PowerErgCurveConsuntive, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(PowerErgCurveConsuntive) filter?: Filter<PowerErgCurveConsuntive>,
  ): Promise<PowerErgCurveConsuntive[]> {
    return this.powerErgCurveConsuntiveRepository.find(filter);
  }

  @get('/erg-api/v1/curve-consuntive/{id}', {
    responses: {
      '200': {
        description: 'PowerErgCurveConsuntive model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(PowerErgCurveConsuntive, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PowerErgCurveConsuntive, {exclude: 'where'}) filter?: FilterExcludingWhere<PowerErgCurveConsuntive>
  ): Promise<PowerErgCurveConsuntive> {
    return this.powerErgCurveConsuntiveRepository.findById(id, filter);
  }

}
