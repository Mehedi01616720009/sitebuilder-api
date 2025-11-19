export interface IRole {
    id: string;
    name: string;
    description?: string;
    permissions: string[];
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
