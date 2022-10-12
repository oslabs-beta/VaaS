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

const apiRoute: Api = Object.freeze(new Api("http://localhost:3020"));



const customFuncBody: { [key: string]: null } = {
  "cows": null,
  
};

const functionCost: { [kay: string]: number } = {
  lambdaChargeGBSecond: 0.00001667,
  lambdaRequestCharge: 0.20,
  lambdaFreeTier: 400000,
  lambdaFreeRequests: 1000000,
  lambdaHTTPCharge: 3.50,

  azureChargeGBSecond: 0.000016,
  azureRequestCharge: 0.20,
  azureFreeTier: 400000,
  azureFreeRequests: 1000000,
  azureHTTPCharge: 0,

  googleChargeGBSecond: 0.0000025,
  googleChargeGHzSecond: 0.0000100,
  googleRequestCharge: 0.40,
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



export {
  apiRoute,
  customFuncBody,
  functionCost,
};
  
