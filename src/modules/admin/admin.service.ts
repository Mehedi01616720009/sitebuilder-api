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
        profileImage: payload?.profileImage?.trim() || null,
    };

    const QueryGetAdmin = 'SELECT "id" FROM "Admins" WHERE "email" = $1';
    const ValuesGetAdmin = [createAdminData.email];
    const GetAdmin = await Query(QueryGetAdmin, ValuesGetAdmin);
    if (Number(GetAdmin?.rowCount) > 0) {
        throw new AppError(409, 'Email already exist');
    }

    const MutationCreateAdmin =
        'INSERT INTO "Admins" ("email", "name", "phone", "role", "profileImage") VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const ValuesCreateAdmin = [
        createAdminData.email,
        createAdminData.name,
        createAdminData.phone,
        createAdminData.role,
        createAdminData.profileImage,
    ];
    const Result = await Query(MutationCreateAdmin, ValuesCreateAdmin);
    return Result.rows[0];
};

const getAdminsFromDB = async (query: Record<string, unknown>) => {
    const { page, limit, skip } = getPaginate(query);

    const QueryGetAdmins =
        'SELECT "id", "email", "name", "phone", "role", "status", "profileImage", "isDeleted" FROM "Admins" WHERE "role" != $1 ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3';
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
        'SELECT "id" FROM "Admins" WHERE "id" = $1 AND "role" != $2';
    const ValuesGetAdmin = [id, ROLES.SuperAdmin];
    const GetAdmin = await Query(QueryGetAdmin, ValuesGetAdmin);
    if (Number(GetAdmin?.rowCount) === 0) {
        throw new AppError(404, 'No admin found');
    }

    const allowedFields: (keyof IAdmin)[] = [
        'name',
        'phone',
        'role',
        'status',
        'profileImage',
    ];

    const setClauses: string[] = [];
    const ValuesUpdateAdmin: (string | number | boolean | Date)[] = [];
    let paramIndex = 1;

    for (const key of allowedFields) {
        const value = payload[key];

        if (value !== undefined && value !== null) {
            setClauses.push(`"${key}" = $${paramIndex}`);
            ValuesUpdateAdmin.push(
                typeof value === 'string' ? value.trim() : value,
            );
            paramIndex++;
        }
    }

    if (setClauses.length === 0) {
        throw new AppError(400, 'No valid fields to update');
    }

    ValuesUpdateAdmin.push(id);

    const MutationUpdateAdmin = `
        UPDATE "Admins"
        SET ${setClauses.join(', ')}
        WHERE "id" = $${paramIndex}
        RETURNING *
    `;

    const Result = await Query(MutationUpdateAdmin, ValuesUpdateAdmin);
    return Result.rows[0];
};

const updateAdminSelfIntoDB = async (
    authPayload: JwtPayload,
    payload: Partial<IAdmin>,
) => {
    const QueryGetAdmin = 'SELECT "id" FROM "Admins" WHERE "id" = $1';
    const ValuesGetAdmin = [authPayload.id];
    const GetAdmin = await Query(QueryGetAdmin, ValuesGetAdmin);
    if (Number(GetAdmin?.rowCount) === 0) {
        throw new AppError(404, 'No admin found');
    }

    const allowedFields: (keyof IAdmin)[] = [
        'name',
        'phone',
        'role',
        'status',
        'profileImage',
    ];

    const setClauses: string[] = [];
    const ValuesUpdateAdmin: (string | number | boolean | Date)[] = [];
    let paramIndex = 1;

    for (const key of allowedFields) {
        const value = payload[key];

        if (value !== undefined && value !== null) {
            setClauses.push(`"${key}" = $${paramIndex}`);
            ValuesUpdateAdmin.push(
                typeof value === 'string' ? value.trim() : value,
            );
            paramIndex++;
        }
    }

    if (setClauses.length === 0) {
        throw new AppError(400, 'No valid fields to update');
    }

    ValuesUpdateAdmin.push(authPayload.id);

    const MutationUpdateAdmin = `
        UPDATE "Admins"
        SET ${setClauses.join(', ')}
        WHERE "id" = $${paramIndex}
        RETURNING *
    `;

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
