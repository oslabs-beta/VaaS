import express, { Router } from 'express';
import Initializers from '../warehouse/initializers';

const router: Router = express.Router();

// FUNNEL REQUEST DATA THROUGH INITIALIZING MIDDLEWARES
router.use(Object.values(Initializers));

// ALL INITIALIZERS RUN BEFORE REACHING ENDPOINTS
export default router;
