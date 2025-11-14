import { updatedAtTrigger } from '../../utils/updatedAtTrigger';

export const Coupon = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'discount_type') THEN
            CREATE TYPE discount_type AS ENUM ('Fixed', 'Percentage');
        END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS "Coupons" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(100) UNIQUE NOT NULL,
        "discountType" discount_type NOT NULL,
        "discountAmount" NUMERIC(10, 2) NOT NULL,
        "discountCurrency" VARCHAR(10) NOT NULL CHECK ("discountCurrency" IN ('BDT', 'USD', 'EUR')),
        "usageGlobalLimit" INT NOT NULL DEFAULT 0,
        "usageUserLimit" INT NOT NULL DEFAULT 0,
        "issuedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "expiredAt" TIMESTAMP NOT NULL,
        "createdBy" UUID NOT NULL REFERENCES "Admins" ("id") ON DELETE CASCADE,
        "isDeleted" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`;

export const CouponIndexes = `
    CREATE INDEX IF NOT EXISTS idx_coupons_isDeleted ON "Coupons" ("isDeleted");
    CREATE INDEX IF NOT EXISTS idx_coupons_createdAt ON "Coupons" ("createdAt");
`;

export const CouponUpdatedAt = updatedAtTrigger('Coupons');

export const CouponMigrations = [Coupon, CouponUpdatedAt, CouponIndexes];
