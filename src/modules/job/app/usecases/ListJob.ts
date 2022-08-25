import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { JobDTO, JobRepository } from "../../domain/jobRepository";

export interface ListJobs {
    execute({
        pagination,
        filter,
        sort,
    }: any): Promise<Either<Failure, PaginatedQueryResult<JobDTO[]>>>;
}

@injectable()
export class ListJobsImpl implements ListJobs {
    constructor(
        @inject("JobRepository")
        private jobRepository: JobRepository
    ) { }
    async execute({
        pagination,
        filter,
        sort
    }: any): Promise<Either<Failure, PaginatedQueryResult<JobDTO[]>>> {
        return await this.jobRepository.findJobs({
            pagination,
            filter,
            sort
        });
    }
}