import { ROLES } from '../constant/role';
import { Query } from './Database';

const role = {
    name: 'Super Admin',
    description: 'This role has all permissions',
};

const SeedRole = async () => {
    const QueryGetRole = 'SELECT "id" FROM "Roles" WHERE "name" = $1';
    const ValuesGetRole = [ROLES.SuperAdmin];
    const GetRole = await Query(QueryGetRole, ValuesGetRole);
    if (Number(GetRole?.rowCount) === 0) {
        const MutationCreateRole =
            'INSERT INTO "Roles" ("name", "description") VALUES ($1, $2) RETURNING *';
        const ValuesCreateRole = [role.name, role.description];
        await Query(MutationCreateRole, ValuesCreateRole);
    }
};

export default SeedRole;
