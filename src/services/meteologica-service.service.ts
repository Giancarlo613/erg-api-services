import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {MeteologicaDataSource} from '../datasources';

export interface LoginParameters {
  request: {
    username: string;
    password: string;
  }
}

export interface LoginResponse {
  result: {
    return: {
      errorCode: string;
      header: {
        sessionToken: string;
        errorCode: string;
      }
    }
  }
}

export interface GetAllFacilitiesParameters {
  request: {
    header: {
      sessionToken: string;
    }
  }
}

export interface Facility {
  facilityId: string;
  facilityName: string;
  installedCapacity: number;
  lat: number;
  long: number;
  timezone: string;
}

export interface GetAllFacilitiesResponse {
  result: {
    return: {
      errorCode: string;
      header: {
        sessionToken: string;
        errorCode: string;
      };
      facilityItems: {
        item: [Facility]
      }
    }
  }
}

// export interface GetAllFacilitiesResponse {
//   result: {
//     return: {
//       errorCode: string;
//       header: {
//         sessionToken: string;
//         errorCode: string;
//       };
//       facilityItems: [
//         {
//           item: {
//             facilityId: string;
//             facilityName: string;
//             installedCapacity: number;
//             lat: number;
//             long: number;
//             timezone: string;
//           }
//         }
//       ]
//     }
//   }
// }

export interface GetForecastParameters {
  request: {
    facilityId: string;
    variableId: string;
    predictorId: string;
    fromDate?: string;
    toDate?: string;
    forecastDate?: string;
    granularity: string;
    percentiles?: string;
    header: {
      sessionToken: string;
    };
  }
}

export interface GetForecastResponse {
  result: {
    return: {
      errorCode: string;
      header: {
        sessionToken: string;
        errorCode: string;
      };
      facilityId: string;
      variableId: string;
      predictorId: string;
      forecastDate: string;
      granularity: number;
      forecastData: string;
    }
  }
}

export interface GetForecastMultiParameters {
  request: {
    header: {
      sessionToken: string;
    };
    variableId: string;
    predictorId: string;
    fromDate: string;
    toDate: string;
    forecastDate: string;
    granularity: string;
    percentiles: string;
    facilitiesId: [
      {
        item: string
      }
    ]
  }
}

export interface ForecastData {
  forecastDate: string;
  facilityId: string;
  forecastData: string;
}

export interface GetForecastMultiResponse {
  result: {
    return: {
      errorCode: string;
      header: {
        sessionToken: string;
        errorCode: string;
      };
      facilityId: string;
      variableId: string;
      predictorId: string;
      granularity: number;
      facilitiesForecastData: [ForecastData]
    }
  }
}

export interface LogoutParameters {
  request: {
    header: {
      sessionToken: string;
    }
  }
}

export interface LogoutResponse {
  result: {
    return: {
      errorCode: string;
      header: {
        sessionToken: string;
        errorCode: string;
      }
    }
  }
}

export interface MeteologicaService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  login(args: LoginParameters): Promise<LoginResponse>;
  logout(args: LogoutParameters): Promise<LogoutResponse>;
  getAllFacilities(args: GetAllFacilitiesParameters): Promise<GetAllFacilitiesResponse>;
  getForecast(args: GetForecastParameters): Promise<GetForecastResponse>;
  getForecastMulti(args: GetForecastMultiParameters): Promise<GetForecastMultiResponse>;
}

export class MeteologicaServiceProvider implements Provider<MeteologicaService> {
  constructor(
    // meteologica must match the name property in the datasource json file
    @inject('datasources.meteologica')
    protected dataSource: MeteologicaDataSource = new MeteologicaDataSource(),
  ) {}

  value(): Promise<MeteologicaService> {
    return getService(this.dataSource);
  }
}
