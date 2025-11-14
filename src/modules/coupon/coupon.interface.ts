export interface ICoupon {
    id: string;
    name: string;
    discountType: 'Fixed' | 'Percentage';
    discountAmount: number;
    discountCurrency: 'BDT' | 'USD' | 'EUR';
    issuedAt: Date;
    expiredAt: Date;
    usageGlobalLimit: number;
    usageUserLimit: number;
    createdBy: string; // FKey --> Admins(id)
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
