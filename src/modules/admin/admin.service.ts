import { JwtPayload } from 'jsonwebtoken';
import { ROLES } from '../../constant/role';
import { Query } from '../../DB/Database';
import AppError from '../../errors/AppError';
import getPaginate from '../../utils/getPaginate';
import { IAdmin } from './admin.interface';

const createAdminIntoDB = async (payload: IAdmin) => {
    const createAdminData = {
        email: payload.email.trim().toLocaleLowerCase(),
        name: payload.name.trim(),
        phone: payload.phone.trim(),
        role: payload.role.trim(),
        image: payload?.image?.trim() || null,
    };

    const QueryGetAdmin = 'SELECT "id" FROM "Admins" WHERE "email" = $1';
    const ValuesGetAdmin = [createAdminData.email];
    const GetAdmin = await Query(QueryGetAdmin, ValuesGetAdmin);
    if (Number(GetAdmin?.rowCount) > 0) {
        throw new AppError(409, 'Email already exist');
    }

    const MutationCreateAdmin =
        'INSERT INTO "Admins" ("email", "name", "phone", "role", "image") VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const ValuesCreateAdmin = [
        createAdminData.email,
        createAdminData.name,
        createAdminData.phone,
        createAdminData.role,
        createAdminData.image,
    ];
    const Result = await Query(MutationCreateAdmin, ValuesCreateAdmin);
    return Result.rows[0];
};

const getAdminsFromDB = async (query: Record<string, unknown>) => {
    const { page, limit, skip } = getPaginate(query);

    const QueryGetAdmins =
        'SELECT "id", "email", "name", "phone", "role", "status", "image", "isDeleted" FROM "Admins" WHERE "role" != $1 ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3';
    const ValuesGetAdmins = [ROLES.SuperAdmin, limit, skip];

    const CountQuery = 'SELECT COUNT("id") FROM "Admins"';

    const Result = await Query(QueryGetAdmins, ValuesGetAdmins);
    const Count = await Query(CountQuery);

    return {
        result: Result?.rows,
        meta: {
            page,
            limit,
            totalPage: Math.ceil(Count?.rows?.[0]?.count / limit),
            totalDoc: Count?.rows?.[0]?.count,
        },
    };
};

const getAdminFromDB = async (id: string) => {
    const QueryGetAdmin =
        'SELECT * FROM "Admins" WHERE "id" = $1 AND "role" != $2';
    const ValuesGetAdmin = [id, ROLES.SuperAdmin];

    const Result = await Query(QueryGetAdmin, ValuesGetAdmin);
    return Result?.rows?.[0] || null;
};

const updateAdminIntoDB = async (id: string, payload: Partial<IAdmin>) => {
    const QueryGetAdmin =
        'SELECT "name", "phone", "role", "status", "image" FROM "Admins" WHERE "id" = $1 AND "role" != $2';
    const ValuesGetAdmin = [id, ROLES.SuperAdmin];
    const GetAdmin = await Query(QueryGetAdmin, ValuesGetAdmin);
    if (Number(GetAdmin?.rowCount) === 0) {
        throw new AppError(404, 'No admin found');
    }
    const Admin = GetAdmin.rows[0];

    const updateAdminData = {
        name: payload?.name?.trim() || Admin.name,
        phone: payload?.phone?.trim() || Admin.phone,
        role: payload?.role?.trim() || Admin.role,
        status: payload?.status?.trim() || Admin.status,
        image: payload?.image?.trim() || Admin.image || null,
    };

    const MutationUpdateAdmin =
        'UPDATE "Admins" SET "name" = $1, "phone" = $2, "role" = $3, "status" = $4, "image" = $5 WHERE "id" = $6 RETURNING *';
    const ValuesUpdateAdmin = [
        updateAdminData.name,
        updateAdminData.phone,
        updateAdminData.role,
        updateAdminData.status,
        updateAdminData.image,
        id,
    ];
    const Result = await Query(MutationUpdateAdmin, ValuesUpdateAdmin);
    return Result.rows[0];
};

const updateAdminSelfIntoDB = async (
    userPayload: JwtPayload,
    payload: Partial<IAdmin>,
) => {
    const QueryGetAdmin =
        'SELECT "name", "phone", "role", "status", "image" FROM "Admins" WHERE "id" = $1';
    const ValuesGetAdmin = [userPayload.id];
    const GetAdmin = await Query(QueryGetAdmin, ValuesGetAdmin);
    if (Number(GetAdmin?.rowCount) === 0) {
        throw new AppError(404, 'No admin found');
    }
    const Admin = GetAdmin.rows[0];

    const updateAdminData = {
        name: payload?.name?.trim() || Admin.name,
        phone: payload?.phone?.trim() || Admin.phone,
        role: payload?.role?.trim() || Admin.role,
        status: payload?.status?.trim() || Admin.status,
        image: payload?.image?.trim() || Admin.image || null,
    };

    const MutationUpdateAdmin =
        'UPDATE "Admins" SET "name" = $1, "phone" = $2, "role" = $3, "status" = $4, "image" = $5 WHERE "id" = $6 RETURNING *';
    const ValuesUpdateAdmin = [
        updateAdminData.name,
        updateAdminData.phone,
        updateAdminData.role,
        updateAdminData.status,
        updateAdminData.image,
        userPayload.id,
    ];
    const Result = await Query(MutationUpdateAdmin, ValuesUpdateAdmin);
    return Result.rows[0];
};

const verifyAdminEmailIntoDB = async (id: string) => {
    const QueryGetAdmin = 'SELECT "id" FROM "Admins" WHERE "id" = $1';
    const ValuesGetAdmin = [id];
    const GetAdmin = await Query(QueryGetAdmin, ValuesGetAdmin);
    if (Number(GetAdmin?.rowCount) === 0) {
        throw new AppError(404, 'No admin found');
    }

    const MutationVerifyAdmin =
        'UPDATE "Admins" SET "isVerified" = $1 WHERE "id" = $2';
    const ValuesVerifyAdmin = [true, id];
    await Query(MutationVerifyAdmin, ValuesVerifyAdmin);
    return null;
};

const deleteAdminFromDB = async (id: string) => {
    const QueryGetAdmin =
        'SELECT "id" FROM "Admins" WHERE "id" = $1 AND "role" != $2';
    const ValuesGetAdmin = [id, ROLES.SuperAdmin];
    const GetAdmin = await Query(QueryGetAdmin, ValuesGetAdmin);
    if (Number(GetAdmin?.rowCount) === 0) {
        throw new AppError(404, 'No admin found');
    }

    const MutationDeleteAdmin =
        'UPDATE "Admins" SET "isDeleted" = $1 WHERE "id" = $2';
    const ValuesDeleteAdmin = [true, id];
    await Query(MutationDeleteAdmin, ValuesDeleteAdmin);
    return null;
};

export const AdminServices = {
    createAdminIntoDB,
    getAdminsFromDB,
    getAdminFromDB,
    updateAdminIntoDB,
    updateAdminSelfIntoDB,
    verifyAdminEmailIntoDB,
    deleteAdminFromDB,
};
