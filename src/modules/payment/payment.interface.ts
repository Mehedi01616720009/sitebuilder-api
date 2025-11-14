export interface IPayInfo {
    amount: number;
    account?: string;
    trxID?: string;
    paidAt: Date;
}

export interface IPayment {
    id: string;
    userID: string; // FKey --> Users(id)
    purchaseID: string; // FKey --> Purchases(id)
    amount: number;
    currency: 'BDT' | 'USD' | 'EUR';
    payMethod: 'Stripe' | 'Payoneer' | 'Bkash' | 'Nagad' | 'Rocket' | 'Upay';
    payInfo: IPayInfo;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
