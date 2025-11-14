import { updatedAtTrigger } from '../../utils/updatedAtTrigger';

export const Purchase = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pay_status') THEN
            CREATE TYPE pay_status AS ENUM ('Paid', 'Pending', 'Refunded');
        END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS "Purchases" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userID" UUID NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
        "planID" UUID NOT NULL REFERENCES "Plans" ("id") ON DELETE CASCADE,
        "status" VARCHAR(20) NOT NULL CHECK (status IN ('Active', 'Inactive')) DEFAULT 'Inactive',
        "payStatus" pay_status NOT NULL,
        "price" NUMERIC(12, 2) NOT NULL CHECK ("price" >= 0),
        "discount" NUMERIC(12, 2) DEFAULT 0 CHECK ("discount" >= 0),
        "totalAmount" NUMERIC(12, 2) NOT NULL CHECK ("totalAmount" >= 0),
        "paidAmount" NUMERIC(12, 2) DEFAULT 0 CHECK ("paidAmount" >= 0),
        "currency" VARCHAR(10) NOT NULL CHECK ("currency" IN ('BDT', 'USD', 'EUR')),
        "couponID" UUID REFERENCES "Coupons" ("id") ON DELETE SET NULL,
        "expiredAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "isDeleted" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`;

export const PurchaseIndexes = `
    CREATE INDEX IF NOT EXISTS idx_purchases_userID ON "Purchases" ("userID");
    CREATE INDEX IF NOT EXISTS idx_purchases_planID ON "Purchases" ("planID");
    CREATE INDEX IF NOT EXISTS idx_purchases_couponID ON "Purchases" ("couponID");
    CREATE INDEX IF NOT EXISTS idx_purchases_status ON "Purchases" ("status");
    CREATE INDEX IF NOT EXISTS idx_purchases_payStatus ON "Purchases" ("payStatus");
    CREATE INDEX IF NOT EXISTS idx_purchases_expiredAt ON "Purchases" ("expiredAt");
`;

const PurchaseUpdatedAt = updatedAtTrigger('Purchases');

export const PurchaseMigrations = [
    Purchase,
    PurchaseUpdatedAt,
    PurchaseIndexes,
];
