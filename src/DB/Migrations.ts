import { AdminMigrations } from '../modules/admin/admin.model';
import { CouponMigrations } from '../modules/coupon/coupon.model';
import { PaymentMigrations } from '../modules/payment/payment.model';
import { PlanMigrations } from '../modules/plan/plan.model';
import { PurchaseMigrations } from '../modules/purchase/purchase.model';
import { UserMigrations } from '../modules/user/user.model';

export const Migrations = [
    ...AdminMigrations,
    ...UserMigrations,
    ...PlanMigrations,
    ...CouponMigrations,
    ...PurchaseMigrations,
    ...PaymentMigrations,
];
