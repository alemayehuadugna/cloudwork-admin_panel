type Client = {
    clientId: string;
    firstName: string;
    lastName: string;
    userName: string;
    phone: string;
    email: string;
    password: string;
    completedJobs: number;
    ongoingJobs: number;
    cancelledJobs: number;
    description?: string;
    websiteUrl?: string;
    address: Address;
    socialLinks?: SocialLinks[];
    favorites?: [];
    companyName?: string;
    languages?: Language[];
    workCategory?: string[];
    verified: boolean;
    profilePicture: string;
    rating: Rating;
    roles: string[];
    profileUrl: string;
    spending: number;
    state: string;
};

type Address = {
    region: string;
    city: string;
    areaName: string;
    postalCode: string;
};

type SocialLinks = {
    socialMedia: string;
    link: string;
};

type Language = {
    language: string;
    proficiencyLevel: string;
};

type Rating = {
    rate: number;
    totalRate: number;
    totalRaters: number;
};

export type { Rating, SocialLinks, Address, Language, Client };
