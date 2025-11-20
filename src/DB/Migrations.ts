import { AdminMigrations } from '../modules/admin/admin.model';
import { RoleMigrations } from '../modules/role/role.model';

export const Migrations = [
    ...RoleMigrations,
    ...AdminMigrations,
    // ...UserMigrations,
    // ...PlanMigrations,
    // ...CouponMigrations,
    // ...PurchaseMigrations,
    // ...PaymentMigrations,
];
