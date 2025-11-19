import { JwtPayload } from 'jsonwebtoken';
import { Query } from '../../DB/Database';
import AppError from '../../errors/AppError';
import { ROLE_PERMISSIONS } from './role.constant';
import { IRole } from './role.interface';
import { isAdminExistByID } from '../admin/admin.util';

const createRoleIntoDB = async (payload: IRole, authPayload: JwtPayload) => {
    const Admin = await isAdminExistByID(authPayload.userID);
    if (!Admin) {
        throw new AppError(404, 'No admin found');
    }

    const createRoleData = {
        name: payload.name.trim(),
        description: payload?.description?.trim() || null,
        permissions: payload.permissions,
    };

    const QueryGetRole = `SELECT "id" FROM "Roles" WHERE "name" = $1`;
    const ValuesGetRole = [createRoleData.name];
    const GetRole = await Query(QueryGetRole, ValuesGetRole);
    if (Number(GetRole?.rowCount) > 0) {
        throw new AppError(409, 'Role already exist');
    }

    const MutationCreateRole = `
        INSERT INTO "Roles" ("name", "description", "permissions") 
        VALUES ($1, $2, $3) 
        RETURNING *
    `;
    const ValuesCreateRole = [
        createRoleData.name,
        createRoleData.description,
        createRoleData.permissions,
    ];
    const Result = await Query(MutationCreateRole, ValuesCreateRole);
    return Result.rows[0];
};

const getRolesFromDB = async () => {
    const QueryGetRoles = `
        SELECT "id", "name" 
        FROM "Roles" 
        ORDER BY "createdAt" DESC
    `;
    const QueryCount = `SELECT COUNT("id") FROM "Roles"`;

    const Result = await Query(QueryGetRoles);
    const Count = await Query(QueryCount);

    return {
        result: Result?.rows,
        meta: {
            page: 1,
            limit: Count?.rows?.[0]?.count || 0,
            totalPage: 1,
            totalDoc: Count?.rows?.[0]?.count || 0,
        },
    };
};

const getPermissionsFromDB = async (authPayload: JwtPayload) => {
    const Admin = await isAdminExistByID(authPayload.userID);
    if (!Admin) {
        throw new AppError(404, 'No admin found');
    }

    const Result = Object.values(ROLE_PERMISSIONS);
    return {
        result: Result,
        meta: {
            page: 1,
            limit: Result.length || 0,
            totalPage: 1,
            totalDoc: Result.length || 0,
        },
    };
};

const getRoleFromDB = async (id: string, authPayload: JwtPayload) => {
    const Admin = await isAdminExistByID(authPayload.userID);
    if (!Admin) {
        throw new AppError(404, 'No admin found');
    }

    const QueryGetRole = `
        SELECT * 
        FROM "Roles" 
        WHERE "id" = $1
    `;
    const ValuesGetRole = [id];

    const Result = await Query(QueryGetRole, ValuesGetRole);
    return Result?.rows?.[0] || null;
};

const getRoleByNameFromDB = async (name: string, authPayload: JwtPayload) => {
    const Admin = await isAdminExistByID(authPayload.userID);
    if (!Admin) {
        throw new AppError(404, 'No admin found');
    }

    const QueryGetRole = `
        SELECT * 
        FROM "Roles" 
        WHERE "name" = $1
    `;
    const ValuesGetRole = [name];

    const Result = await Query(QueryGetRole, ValuesGetRole);
    if (Number(Result?.rowCount) === 0) {
        throw new AppError(404, 'No role found');
    }

    return Result.rows[0];
};

const updateRoleIntoDB = async (
    id: string,
    payload: Pick<IRole, 'description' | 'permissions'>,
    authPayload: JwtPayload,
) => {
    const Admin = await isAdminExistByID(authPayload.userID);
    if (!Admin) {
        throw new AppError(404, 'No admin found');
    }

    const QueryGetRole = `
        SELECT "description", "permissions" 
        FROM "Roles" 
        WHERE "id" = $1
    `;
    const ValuesGetRole = [id];
    const GetRole = await Query(QueryGetRole, ValuesGetRole);
    if (Number(GetRole?.rowCount) === 0) {
        throw new AppError(404, 'No role found');
    }
    const Role = GetRole.rows[0];

    const updateRoleData = {
        description: payload?.description?.trim() || Role.description,
        permissions: payload?.permissions || Role.permissions,
    };

    const MutationRoleAdmin = `
        UPDATE "Roles" 
        SET "description" = $1, "permissions" = $2 
        WHERE "id" = $3 
        RETURNING *
    `;
    const ValuesUpdateRole = [
        updateRoleData.description,
        updateRoleData.permissions,
        id,
    ];
    const Result = await Query(MutationRoleAdmin, ValuesUpdateRole);
    return Result.rows[0];
};

const deleteRoleFromDB = async (id: string, authPayload: JwtPayload) => {
    const Admin = await isAdminExistByID(authPayload.userID);
    if (!Admin) {
        throw new AppError(404, 'No admin found');
    }

    const QueryGetRole = `
        SELECT "id" 
        FROM "Roles" 
        WHERE "id" = $1
    `;
    const ValuesGetRole = [id];
    const GetRole = await Query(QueryGetRole, ValuesGetRole);
    if (Number(GetRole?.rowCount) === 0) {
        throw new AppError(404, 'No role found');
    }

    const MutationDeleteRole = `
        UPDATE "Roles" 
        SET "isDeleted" = $1 
        WHERE "id" = $2
    `;
    const ValuesDeleteRole = [true, id];
    await Query(MutationDeleteRole, ValuesDeleteRole);
    return null;
};

export const RoleServices = {
    createRoleIntoDB,
    getRolesFromDB,
    getPermissionsFromDB,
    getRoleFromDB,
    getRoleByNameFromDB,
    updateRoleIntoDB,
    deleteRoleFromDB,
};
