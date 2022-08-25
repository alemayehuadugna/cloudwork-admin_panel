type Files = {
    title: string;
    description: string;
    link: string;
    uploader: string;
    uploadDate: Date;
    size: number;
    type: string;
};

type Job = {
    jobId: string;
    title: string;
    budget: number;
    progress: string;
    experience: string;
    startDate: string;
    files: Files[];
    expiry: Date;
    logo: string;
};

export type {
    Files,
    Job
};