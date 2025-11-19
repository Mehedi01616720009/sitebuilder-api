import { updatedAtTrigger } from '../../utils/updatedAtTrigger';

export const Admin = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admins_status') THEN
            CREATE TYPE admins_status AS ENUM ('Active', 'Deactive', 'Blocked');
        END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS "Admins" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "isVerified" BOOLEAN DEFAULT FALSE,
        "name" VARCHAR(100) NOT NULL,
        "phone" VARCHAR(15) NOT NULL,
        "role" VARCHAR(40) NOT NULL REFERENCES "Roles" ("name") ON DELETE CASCADE,
        "status" admins_status DEFAULT 'Active',
        "profileImage" TEXT,
        "isDeleted" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`;

export const AdminIndexes = `
    CREATE INDEX IF NOT EXISTS idx_admins_isVerified ON "Admins" ("isVerified");
    CREATE INDEX IF NOT EXISTS idx_admins_phone ON "Admins" ("phone");
    CREATE INDEX IF NOT EXISTS idx_admins_status ON "Admins" ("status");
    CREATE INDEX IF NOT EXISTS idx_admins_isDeleted ON "Admins" ("isDeleted");
    CREATE INDEX IF NOT EXISTS idx_admins_createdAt ON "Admins" ("createdAt");
`;

export const AdminUpdatedAt = updatedAtTrigger('Admins');

export const AdminMigrations = [Admin, AdminUpdatedAt, AdminIndexes];
