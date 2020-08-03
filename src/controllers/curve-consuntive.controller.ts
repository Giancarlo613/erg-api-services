import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,

  repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param
} from '@loopback/rest';
import {PowerErgCurveConsuntive} from '../models';
import {PowerErgCurveConsuntiveRepository} from '../repositories';

@authenticate('jwt')
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

}
