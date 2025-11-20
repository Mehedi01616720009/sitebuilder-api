export interface IAdmin {
    id: string;
    email: string;
    isVerified: boolean;
    name: string;
    phone: string;
    role: string;
    status: 'Active' | 'Deactive' | 'Blocked';
    profileImage?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
