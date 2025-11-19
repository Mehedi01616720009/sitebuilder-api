import { updatedAtTrigger } from '../../utils/updatedAtTrigger';

export const Role = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";

    CREATE TABLE IF NOT EXISTS "Roles" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" VARCHAR(40) UNIQUE NOT NULL,
        "description" TEXT,
        "permissions" JSONB NOT NULL CHECK (jsonb_typeof("permissions") = 'array') DEFAULT '[]',
        "isDeleted" BOOLEAN DEFAULT FALSE,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
`;

export const RoleIndexes = `
    CREATE INDEX IF NOT EXISTS idx_roles_isDeleted ON "Roles" ("isDeleted");
    CREATE INDEX IF NOT EXISTS idx_roles_createdAt ON "Roles" ("createdAt");
`;

export const RoleUpdatedAt = updatedAtTrigger('Roles');

export const RoleMigrations = [Role, RoleUpdatedAt, RoleIndexes];
