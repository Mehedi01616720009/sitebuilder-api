import { ROLES } from '../constant/role';
import { Query } from './Database';

const superAdmins = [
    {
        email: 'mehedi01616720009@gmail.com',
        name: 'Mehedi Hasan',
        phone: '+8801616720009',
    },
    {
        email: 'razibhsarkar92@gmail.com',
        name: 'Razib Hossain Sarkar',
        phone: '+8801863188699',
    },
];

const SeedSuperAdmin = async () => {
    const emails = superAdmins.map(admin => admin.email);
    const QueryGetAdmins =
        'SELECT "email" FROM "Admins" WHERE "email" = ANY($1)';
    const ValuesGetAdmins = [emails];
    const GetAdmins = await Query(QueryGetAdmins, ValuesGetAdmins);
    if (Number(GetAdmins?.rowCount) === 0) {
        const MutationCreateAdminOne =
            'INSERT INTO "Admins" ("email", "name", "phone", "role", "image") VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const ValuesCreateAdminOne = [
            superAdmins[0].email,
            superAdmins[0].name,
            superAdmins[0].phone,
            ROLES.SuperAdmin,
            null,
        ];
        const MutationCreateAdminTwo =
            'INSERT INTO "Admins" ("email", "name", "phone", "role", "image") VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const ValuesCreateAdminTwo = [
            superAdmins[1].email,
            superAdmins[1].name,
            superAdmins[1].phone,
            ROLES.SuperAdmin,
            null,
        ];
        await Query(MutationCreateAdminOne, ValuesCreateAdminOne);
        await Query(MutationCreateAdminTwo, ValuesCreateAdminTwo);
    }
};

export default SeedSuperAdmin;
