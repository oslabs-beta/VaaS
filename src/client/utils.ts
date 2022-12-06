import { axiosInstance } from './Queries';
interface IApi {
  host: string;
  getRoute: (routeName: string) => string;
}

class Api implements IApi {
  host: string;
  constructor(host: string) {
    this.host = host;
  }

  getRoute(routeName: string) {
    return `${this.host}/api/${routeName}`;
  }
}

const apiRoute: Api = Object.freeze(new Api('http://localhost:3020'));

const checkAuth = async () => {
  console.log('ENTER CHECK AUTH');
  const response = await axiosInstance.get('/auth');
  return response.data;
};

const customFuncBody: { [key: string]: null } = {
  cows: null,
};

const functionCost: { [kay: string]: number } = {
  lambdaChargeGBSecond: 0.00001667,
  lambdaRequestCharge: 0.2,
  lambdaFreeTier: 400000,
  lambdaFreeRequests: 1000000,
  lambdaHTTPCharge: 3.5,

  azureChargeGBSecond: 0.000016,
  azureRequestCharge: 0.2,
  azureFreeTier: 400000,
  azureFreeRequests: 1000000,
  azureHTTPCharge: 0,

  googleChargeGBSecond: 0.0000025,
  googleChargeGHzSecond: 0.00001,
  googleRequestCharge: 0.4,
  googleGBSecondFreeTier: 400000,
  googleGHzSecondFreeTier: 200000,
  googleFreeRequests: 2000000,
  googleHTTPCharge: 0,

  ibmChargeGBSecond: 0.000017,
  ibmRequestCharge: 0,
  ibmFreeTier: 400000,
  ibmFreeRequests: 0,
  ibmHTTPCharge: 0,
};

const GITHUB_CLIENT_ID = '';
const GITHUB_REDIRECT = 'http://localhost:9000';

export const GClientId = '';

export {
  apiRoute,
  customFuncBody,
  functionCost,
  GITHUB_CLIENT_ID,
  GITHUB_REDIRECT,
  checkAuth,
};
