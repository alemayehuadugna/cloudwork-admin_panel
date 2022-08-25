import { Job } from "../domain/job";
import { JobDTO } from "../domain/jobRepository";

const JobMapper = {
    toEntity(json: any): Job {
        const job: Job = {
            jobId: json.id.value,
            title: json.title,
            budget: json.budget,
            progress: json.progress,
            experience: json.experience,
            startDate: json.startDate,
            expiry: json.expiry,
            files: json.files,
            logo: json.logo
        };

        return job;
    },
    toEntities(json: any): JobDTO[] {
        const jobs: JobDTO[] = json.map((entity: any) => {
            return {
                jobId: entity.jobId,
                title: entity.title,
                budget: entity.budget,
                progress: entity.progress,
                experience: entity.experience,
                startDate: entity.startDate,
                expiry: entity.expiry,
                files: entity.files,
                logo: entity.logo
            };
        });
        return jobs;
    },
    toJson(entity: Job): JSON {
        return JSON.parse(JSON.stringify(entity));
    },
};

export { JobMapper };
