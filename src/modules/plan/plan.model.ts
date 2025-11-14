import { updatedAtTrigger } from '../../utils/updatedAtTrigger';

export const Plan = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'plans_category') THEN
            CREATE TYPE plans_category AS ENUM ('PortfolioWebsite', 'ClubWebsite', 'LMSWebsite', 'Storage');
        END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS "Plans" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(100) UNIQUE NOT NULL,
        "category" plans_category NOT NULL,
        "pricing" JSONB NOT NULL DEFAULT '{}'::jsonb,
        "status" VARCHAR(20) NOT NULL CHECK ("status" IN ('Active', 'Inactive')) DEFAULT 'Active',
        "features" JSONB NOT NULL CHECK (jsonb_typeof("features") = 'array') DEFAULT '[]',
        "createdBy" UUID NOT NULL REFERENCES "Admins" ("id") ON DELETE CASCADE,
        "isDeleted" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`;

export const PlanIndexes = `
    CREATE INDEX IF NOT EXISTS idx_plans_category ON "Plans" ("category");
    CREATE INDEX IF NOT EXISTS idx_plans_status ON "Plans" ("status");
    CREATE INDEX IF NOT EXISTS idx_plans_createdAt ON "Plans" ("createdAt");
`;

const PlanUpdatedAt = updatedAtTrigger('Plans');

export const PlanMigrations = [Plan, PlanUpdatedAt, PlanIndexes];
