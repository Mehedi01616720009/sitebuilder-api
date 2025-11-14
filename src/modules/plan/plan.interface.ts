export type TCategory =
    | 'PortfolioWebsite'
    | 'ClubWebsite'
    | 'LMSWebsite'
    | 'Storage';

export interface IPlanPricing {
    monthlyPrice: number;
    quaterPrice: number;
    halfYearlyPrice: number;
    yearlyPrice: number;
}

export interface IPlan {
    id: string;
    name: string;
    category: TCategory;
    pricing: IPlanPricing;
    status: 'Active' | 'Inactive';
    features: string[];
    createdBy: string; // FKey --> Admins(id)
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
