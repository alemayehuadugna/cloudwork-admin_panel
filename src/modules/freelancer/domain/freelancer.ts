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

type Employment = {
    company: string;
    city: string;
    region: string;
    title: string;
    period: {
        from: Date;
        to: Date;
    };
    summary: string;
};

type Education = {
    University: string;
    dateAttended: {
        start: Date;
        end: Date;
    };
    degree: string;
    areaOfStudy: string;
    description: string;
};

type Testimonial = {
    firstName: string;
    lastName: string;
    email: string;
    title: string;
    projectType: string;
    messageToClient: string;
};

type Rating = {
    rate: number;
    totalRate: number;
    totalRaters: number;
};

type FreelancerRatings = {
    skill: Rating;
    qualityOfWork: Rating;
    availability: Rating;
    adherenceToSchedule: Rating;
    communication: Rating;
    cooperation: Rating;
};

type Language = {
    language: string;
    proficiencyLevel: string;
};

type OtherExperience = {
    subject: string;
    description: string;
};

type Freelancer = {
    freelancerId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    gender: string;
    skills: string[];
    overview: string;
    hourlyRate: number;
    socialLinks: SocialLinks[];
    address: Address;
    language: Language[];
    education: Education[];
    employments: Employment[];
    otherExperience: OtherExperience[];
    testimonials: Testimonial[];
    profilePicture: string;
    userName: string;
    earning: number;
    rating: FreelancerRatings;
    workHistory: [];
    reviews: [];
};

export type {
	Rating,
    SocialLinks,
    Address,
    Language,
    Education,
    Employment,
    OtherExperience,
    Testimonial,
    FreelancerRatings,
    Freelancer,
};
