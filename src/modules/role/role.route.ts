import { Router } from 'express';
import SuperAuth from '../../middlewares/SuperAuth';
import validateRequest from '../../middlewares/validateRequest';
import { RoleValidations } from './role.validation';
import { RoleControllers } from './role.controller';

const router: Router = Router();

router.post(
    '/',
    SuperAuth(),
    validateRequest(RoleValidations.createRoleValidationSchema),
    RoleControllers.createRole,
);

router.get('/', SuperAuth(), RoleControllers.getRoles);

router.get('/permissions', SuperAuth(), RoleControllers.getPermissions);

router.get('/:id', SuperAuth(), RoleControllers.getRole);

router.get('/:name/by-name', SuperAuth(), RoleControllers.getRoleByName);

router.patch(
    '/:id/update',
    SuperAuth(),
    validateRequest(RoleValidations.updateRoleValidationSchema),
    RoleControllers.updateRole,
);

router.delete('/:id/delete', SuperAuth(), RoleControllers.deleteRole);

export const RoleRoutes = router;
