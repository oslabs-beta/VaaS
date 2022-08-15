import logger from './logger';
import check from './check';

// THESE MIDDLEWARES RUN BEFORE THE CONTROLLERS DO AND ARE EXECUTED IN ORDER
export default {
  check,
  logger
};
