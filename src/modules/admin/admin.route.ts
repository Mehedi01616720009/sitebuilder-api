import { Router } from 'express';
import { AdminControllers } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidations } from './admin.validation';
import auth from '../../middlewares/auth';
import { ROLES } from '../../constant/role';

const router: Router = Router();

router.post(
    '/',
    auth(ROLES.SuperAdmin, ROLES.Admin),
    validateRequest(AdminValidations.createAdminValidationSchema),
    AdminControllers.createAdmin,
);

router.get(
    '/',
    auth(ROLES.SuperAdmin, ROLES.Admin),
    AdminControllers.getAdmins,
);

router.get(
    '/:id',
    auth(ROLES.SuperAdmin, ROLES.Admin),
    AdminControllers.getAdmin,
);

router.patch(
    '/:id/update',
    auth(ROLES.SuperAdmin, ROLES.Admin),
    validateRequest(AdminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
);

router.patch(
    '/self-update',
    auth(
        ROLES.SuperAdmin,
        ROLES.Admin,
        ROLES.Moderator,
        ROLES.Author,
        ROLES.Accountant,
    ),
    validateRequest(AdminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdmin,
);

router.patch(
    '/:id/verify-email',
    auth(
        ROLES.SuperAdmin,
        ROLES.Admin,
        ROLES.Moderator,
        ROLES.Author,
        ROLES.Accountant,
    ),
    AdminControllers.verifyAdmin,
);

router.delete(
    '/:id/delete',
    auth(ROLES.SuperAdmin),
    AdminControllers.deleteAdmin,
);

export const AdminRoutes = router;
