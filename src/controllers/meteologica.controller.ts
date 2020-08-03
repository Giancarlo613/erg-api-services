
import {authenticate} from '@loopback/authentication';
import {UserRepository} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {configure, getLogger} from 'log4js';
import {
  GetAllFacilitiesParameters, GetAllFacilitiesResponse,
  GetForecastMultiParameters,
  GetForecastMultiResponse, GetForecastParameters, GetForecastResponse,
  LoginParameters, LoginResponse,
  LogoutParameters,
  LogoutResponse, MeteologicaService
} from '../services/meteologica-service.service';

const {LOG_CFG} = require('../../config/config');

configure("./config/log-config.json");
const logger = getLogger(LOG_CFG);

@authenticate('jwt')
export class MeteologicaController {
  constructor(
    @inject('services.MeteologicaService') protected meteologicaService: MeteologicaService,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/erg-api/v1/meteologica/login')
  async login(
    @requestBody({
      content: {
        'application/json': {
          "request": {
            "username": "string",
            "password": "string"
          },
        },
      },
    }) args: LoginParameters
  ): Promise<LoginResponse> {
    try {
      logger.info('MeteologicaController.login ok');
      return await this.meteologicaService.login(args);
    } catch (error) {
      logger.error('MeteologicaController.login - ' + error);
      throw new HttpErrors.BadRequest(error);
    }
  }

  @post('/erg-api/v1/meteologica/get-facilities')
  async getAllFacilities(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          "request": {
            "header": {
              "sessionToken": "string"
            },
          },
        },
      },
    }) args: GetAllFacilitiesParameters
  ): Promise<GetAllFacilitiesResponse> {
    try {
      const userId = currentUserProfile[securityId];
      const user = await this.userRepository.findById(userId);
      if (user.additionalProp1.meteologica_auth === 'all') {
        logger.info('MeteologicaController.getAllFacilities - admin ok');
        return await this.meteologicaService.getAllFacilities(args);
      } else {
        const unit = user.additionalProp1.meteologica_auth;
        const responseData = await this.meteologicaService.getAllFacilities(args);
        let i = 0;
        while (responseData.result.return.facilityItems.item.length > 1) {
          if (responseData.result.return.facilityItems.item[i].facilityId === unit) {
            i++;
          } else {
            responseData.result.return.facilityItems.item.splice(i, 1);
          }
        }
        logger.info('MeteologicaController.getAllFacilities - user ok');
        return responseData;
      }
    } catch (error) {
      logger.error('MeteologicaController.getAllFacilities - ' + error);
      throw new HttpErrors.BadRequest(error);
    }
  }

  @post('/erg-api/v1/meteologica/get-forecast')
  async getForecast(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        "application/json": {
          "request": {
            "facilityId": "string",
            "variableId": "string",
            "predictorId": "string",
            "fromDate": "string",
            "toDate": "string",
            "forecastDate": "string",
            "granularity": "string",
            "percentiles": "string",
            "header": {
              "sessionToken": "string"
            }
          }
        }
      }
    }) args: GetForecastParameters
  ): Promise<GetForecastResponse> {
    // try {
    //   logger.info('MeteologicaController.getForecast - ok');
    //   return await this.meteologicaService.getForecast(args);
    // } catch (error) {
    //   logger.error('MeteologicaController.getForecast - ' + error);
    //   throw new HttpErrors.BadRequest(error);
    // }
    try {
      const userId = currentUserProfile[securityId];
      const user = await this.userRepository.findById(userId);
      if (user.additionalProp1.meteologica_auth === 'all') {
        logger.info('MeteologicaController.getForecast - admin ok');
        return await this.meteologicaService.getForecast(args);
      } else {
        const unit = user.additionalProp1.meteologica_auth;
        const responseData = await this.meteologicaService.getForecast(args);
        if (responseData.result.return.facilityId === unit) {
          logger.info('MeteologicaController.getForecast - user ok');
          return responseData;
        } else {
          throw new HttpErrors.Forbidden();
        }
      }
    } catch (error) {
      logger.error('MeteologicaController.getForecast - ' + error);
      throw new HttpErrors.BadRequest(error);
    }
  }

  @post('/erg-api/v1/meteologica/get-multi-forecast')
  async getForecastMulti(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        "application/json": {
          "request": {
            "variableId": "string",
            "predictorId": "string",
            "fromDate": "string",
            "toDate": "string",
            "forecastDate": "string",
            "granularity": "string",
            "percentiles": "string",
            "facilitiesId": [
              {
                "item": "string"
              }
            ],
            "header": {
              "sessionToken": "string"
            }
          }
        }
      }
    }) args: GetForecastMultiParameters
  ): Promise<GetForecastMultiResponse> {
    // try {
    //   logger.info('MeteologicaController.getForecastMulti - ok');
    //   return await this.meteologicaService.getForecastMulti(args);
    // } catch (error) {
    //   logger.error('MeteologicaController.getForecast - ' + error);
    //   throw new HttpErrors.BadRequest(error);
    // }
    try {
      const userId = currentUserProfile[securityId];
      const user = await this.userRepository.findById(userId);
      const unit = user.additionalProp1.meteologica_auth;
      if (user.additionalProp1.meteologica_auth === 'all') {
        logger.info('MeteologicaController.getForecast - admin ok');
        return await this.meteologicaService.getForecastMulti(args);
      } else {
        for (const f of args.request.facilitiesId) {
          if (f === unit) {
            logger.info('MeteologicaController.getForecast - user ok');
            return await this.meteologicaService.getForecastMulti(args);
          }
        }
        throw new HttpErrors.Forbidden('Accesso non consentito');
      }
    } catch (error) {
      logger.error('MeteologicaController.getForecastMulti - ' + error);
      throw new HttpErrors.BadRequest(error);
    }
  }

  @post('/erg-api/v1/meteologica/logout')
  async logout(
    @requestBody({
      content: {
        'application/json': {
          "request": {
            "username": "string",
            "password": "string"
          },
        },
      },
    }) args: LogoutParameters
  ): Promise<LogoutResponse> {
    try {
      logger.info('MeteologicaController.logout - ok');
      return await this.meteologicaService.logout(args);
    } catch (error) {
      logger.error('MeteologicaController.logout - ' + error);
      throw new HttpErrors.BadRequest(error);
    }
  }

}
