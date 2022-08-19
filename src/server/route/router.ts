import express, { Router } from 'express';
import initializers from '../warehouse/initializers';

const router: Router = express.Router();

// FUNNEL REQUEST DATA THROUGH INITIALIZING MIDDLEWARES
router.use(Object.values(initializers));

// ALL INITIALIZERS RUN BEFORE REACHING ENDPOINTS
export default router;
