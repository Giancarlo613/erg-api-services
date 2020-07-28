import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {get, getModelSchemaRef, HttpErrors, post, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {configure, getLogger} from 'log4js';

const {LOG_CFG} = require('../../config/config');

configure("./config/log-config.json");
const logger = getLogger(LOG_CFG);

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

const CredentialsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE) public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE) public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true}) public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) {}

  @post('/erg-api/v1/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    try {
      // ensure the user exists, and the password is correct
      const user = await this.userService.verifyCredentials(credentials);
      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.userService.convertToUserProfile(user);
      // create a JSON Web Token based on the user profile
      const token = await this.jwtService.generateToken(userProfile);
      logger.info('UserController.login ok - user: ' + user.username);
      return {token};
    } catch (error) {
      logger.error('UserController.login - ' + error);
      throw new HttpErrors.BadRequest(error);
    }
  }

  @authenticate('jwt')
  @get('/erg-api/v1/users/who-am-i', {
    responses: {
      '200': {
        description: '',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
  ): Promise<string> {
    try {
      const userId = currentUserProfile[securityId];
      const user = await this.userRepository.findById(userId);
      if (user !== undefined) {
        logger.info('UserController.whoAmI ok - user: ' + user.username);
        return user.username ?? 'No name user.';
      } else {
        logger.error('UserController.whoAmI - user not found');
        throw new HttpErrors.Unauthorized('user not found');
      }
    } catch (error) {
      logger.error('UserController.whoAmI - ' + error);
      throw new HttpErrors.BadRequest(error);
    }
  }

  @authenticate('jwt')
  @post('/erg-api/v1/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    try {
      const userId = currentUserProfile[securityId];
      const user = await this.userRepository.findById(userId);
      if (user.additionalProp1.gpmpower_auth !== 'all') {
        throw new HttpErrors.Forbidden();
      }
      const password = await hash(newUserRequest.password, await genSalt());
      const savedUser = await this.userRepository.create(
        _.omit(newUserRequest, 'password'),
      );
      await this.userRepository.userCredentials(savedUser.id).create({password});
      logger.info('UserController.signUp - ok');
      return savedUser;
    } catch (error) {
      logger.error('UserController.signUp - ' + error);
      throw new HttpErrors.BadRequest(error);
    }
  }

}
