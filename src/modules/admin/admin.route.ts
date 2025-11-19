import { Router } from 'express';
import { AdminControllers } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidations } from './admin.validation';
import validatePermission from '../../middlewares/validatePermission';
import { ROLE_PERMISSIONS } from '../role/role.constant';
import Self from '../../middlewares/Self';

const router: Router = Router();

router.post(
    '/',
    validatePermission(ROLE_PERMISSIONS.ADMIN_CREATE),
    validateRequest(AdminValidations.createAdminValidationSchema),
    AdminControllers.createAdmin,
);

router.get(
    '/',
    validatePermission(ROLE_PERMISSIONS.ADMIN_READ),
    AdminControllers.getAdmins,
);

router.get(
    '/:id',
    validatePermission(ROLE_PERMISSIONS.ADMIN_READ),
    AdminControllers.getAdmin,
);

router.patch(
    '/:id/update',
    validatePermission(ROLE_PERMISSIONS.ADMIN_UPDATE),
    validateRequest(AdminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
);

router.patch(
    '/self-update',
    Self(),
    validateRequest(AdminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
);

router.patch('/:id/verify-email', Self(), AdminControllers.verifyAdmin);

router.delete(
    '/:id/delete',
    validatePermission(ROLE_PERMISSIONS.ADMIN_DELETE),
    AdminControllers.deleteAdmin,
);

export const AdminRoutes = router;
