import {authenticate} from '@loopback/authentication';
import {UserRepository} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {configure, getLogger} from 'log4js';
import {GetProductionDataRequest, GetProductionDataResponse, GpmService} from '../services';

const {LOG_CFG} = require('../../config/config');

configure("./config/log-config.json");
const logger = getLogger(LOG_CFG);

@authenticate('jwt')
export class GpmControllerController {
  constructor(
    @inject('services.GpmService') protected gpmService: GpmService,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/erg-api/v1/gpm-power/get-all-data')
  async getGpmPowerData(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            "user": "string",
            "password": "string"
          },
        },
      },
    }) args: GetProductionDataRequest
  ): Promise<GetProductionDataResponse[]> {
    try {
      const userId = currentUserProfile[securityId];
      const user = await this.userRepository.findById(userId);
      if (user.additionalProp1.gpmpower_auth === 'all') {
        logger.info('GpmControllerController.getGpmPowerData - admin request ok');
        return await this.gpmService.getProductionData(args);
      } else {
        const unit = user.additionalProp1.gpmpower_auth;
        const data: GetProductionDataResponse[] = await this.gpmService.getProductionData(args);
        const risultato = [];
        for (const valore of data) {
          if (valore.upName === unit) {
            risultato.push(valore);
          }
        }
        logger.info('GpmControllerController.getGpmPowerData - user request ok');
        return risultato;
      }
    } catch (error) {
      logger.error('GpmControllerController.getGpmPowerData - error: ' + error);
      throw new HttpErrors.BadRequest(error);
    }
  }

}
