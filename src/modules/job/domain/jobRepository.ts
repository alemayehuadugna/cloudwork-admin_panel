import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { Either } from "monet";

type JobDTO = {
    jobId: string;
    title: string;
    budget: number;
    progress: string;
    experience: string;
    startDate: Date;
    expiry: Date;
    files: File[];
};

interface JobRepository {
    findJobs({ pagination, filter, sort }): Promise<Either<Failure, PaginatedQueryResult<JobDTO[]>>>;
    searchJob({ pagination, filter }): Promise<Either<Failure, PaginatedQueryResult<JobDTO[]>>>;
    deleteJob(id: string): Promise<Either<Failure, void>>;
    deleteJobForever(id: string): Promise<Either<Failure, void>>;
}

export { JobRepository };
export type { JobDTO };