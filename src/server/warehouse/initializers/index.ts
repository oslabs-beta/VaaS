import logger from './logger';
import check from './check';

// THESE MIDDLEWARES RUN BEFORE OTHER MIDDLEWARES/CONTROLLERS RUN AND ARE EXECUTED IN ORDER
export default {
  check,
  logger,
};
