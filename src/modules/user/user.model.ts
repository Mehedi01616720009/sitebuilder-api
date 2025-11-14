import { updatedAtTrigger } from '../../utils/updatedAtTrigger';

export const User = `
    DO $$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'users_status') THEN
            CREATE TYPE users_status AS ENUM ('Active', 'Deactive', 'Blocked');
        END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS "Users" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "isVerified" BOOLEAN DEFAULT FALSE,
        "name" VARCHAR(100) NOT NULL,
        "phone" VARCHAR(15),
        "role" VARCHAR(20) DEFAULT 'Client' NOT NULL,
        "status" users_status DEFAULT 'Active',
        "image" TEXT,
        "isDeleted" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`;

const UserIndexes = `
    CREATE INDEX IF NOT EXISTS idx_users_isVerified ON "Users" ("isVerified");
    CREATE INDEX IF NOT EXISTS idx_users_status ON "Users" ("status");
    CREATE INDEX IF NOT EXISTS idx_users_isDeleted ON "Users" ("isDeleted");
    CREATE INDEX IF NOT EXISTS idx_users_createdAt ON "Users" ("createdAt");
`;

const UpdatedAt = updatedAtTrigger('Users');

export const UserMigrations = [User, UpdatedAt, UserIndexes];
