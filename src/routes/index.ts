import { Router } from 'express';
import { AdminRoutes } from '../modules/admin/admin.route';
import { AuthRoutes } from '../modules/auth/auth.route';

// route initialization
const router: Router = Router();

// routes data
const routes = [
    {
        path: '/admins',
        route: AdminRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
];

// routes execution
routes.forEach(route => router.use(route.path, route.route));

export default router;
