export interface IUser {
    id: string;
    email: string;
    name: string;
    role: 'Client';
    status: 'Active' | 'Deactive' | 'Blocked';
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
