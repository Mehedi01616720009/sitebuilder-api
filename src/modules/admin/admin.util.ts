import { ROLES } from '../../constant/role';
import { Query } from '../../DB/Database';

export const isAdminExistByID = async (id: string) => {
    const QueryGetAdmin = `
        SELECT "id" 
        FROM "Admins" 
        WHERE "id" = $1 AND "role" = $2 AND "isDeleted" = false
    `;
    const ValuesGetAdmin = [id, ROLES.SuperAdmin, false];

    const Result = await Query(QueryGetAdmin, ValuesGetAdmin);
    return Result?.rows?.[0] || null;
};
