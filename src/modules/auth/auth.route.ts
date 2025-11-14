import { Router } from 'express';
import { AuthControllers } from './auth.controller';

const router: Router = Router();

router.get('/get-token/:userType', AuthControllers.getAccessToken);

export const AuthRoutes = router;
