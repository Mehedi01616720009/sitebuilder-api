export interface IPurchase {
    id: string;
    userID: string; // FKey --> Users(id)
    planID: string; // FKey --> Plans(id)
    status: 'Active' | 'Inactive';
    payStatus: 'Paid' | 'Pending' | 'Refunded';
    price: number;
    discount: number;
    totalAmount: number;
    paidAmount: number;
    currency: 'BDT' | 'USD' | 'EUR';
    couponID?: string; // FKey --> Coupons(id)
    expiredAt: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
