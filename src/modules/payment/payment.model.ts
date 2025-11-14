import { updatedAtTrigger } from '../../utils/updatedAtTrigger';

export const Payment = `
    CREATE TABLE IF NOT EXISTS "Payments" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "userID" UUID NOT NULL REFERENCES "Users" ("id") ON DELETE CASCADE,
        "purchaseID" UUID NOT NULL REFERENCES "Purchases" ("id") ON DELETE CASCADE,
        "amount" NUMERIC(12, 2) NOT NULL CHECK ("amount" >= 0),
        "currency" VARCHAR(10) NOT NULL CHECK ("currency" IN ('BDT', 'USD', 'EUR')),
        "payMethod" VARCHAR(20) NOT NULL CHECK (
            "payMethod" IN ('Stripe', 'Payoneer', 'Bkash', 'Nagad', 'Rocket', 'Upay')
        ),
        "payInfo" JSONB NOT NULL DEFAULT '{}'::jsonb,
        "isDeleted" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`;

export const PaymentIndexes = `
    CREATE INDEX IF NOT EXISTS idx_payments_userID ON "Payments" ("userID");
    CREATE INDEX IF NOT EXISTS idx_payments_purchaseID ON "Payments" ("purchaseID");
    CREATE INDEX IF NOT EXISTS idx_payments_payMethod ON "Payments" ("payMethod");
    CREATE INDEX IF NOT EXISTS idx_payments_createdAt ON "Payments" ("createdAt");
`;

const PaymentUpdatedAt = updatedAtTrigger('Payments');

export const PaymentMigrations = [Payment, PaymentUpdatedAt, PaymentIndexes];
