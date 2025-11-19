import { ROLES } from '../constant/role';
import { ROLE_PERMISSIONS } from '../modules/role/role.constant';

export type TRole = keyof typeof ROLES;
export type TPermission =
    (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS];
