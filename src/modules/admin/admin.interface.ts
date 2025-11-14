export type TAdminRole =
    | 'SuperAdmin'
    | 'Admin'
    | 'Moderator'
    | 'Author'
    | 'Accountant';

export interface IAdmin {
    id: string;
    email: string;
    isVerified: boolean;
    name: string;
    phone: string;
    role: TAdminRole;
    status: 'Active' | 'Deactive' | 'Blocked';
    image?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
