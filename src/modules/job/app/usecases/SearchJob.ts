import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { JobDTO, JobRepository } from "../../domain/jobRepository";

export interface SearchJobs {
    execute({
        pagination,
        filter
    }): Promise<Either<Failure, PaginatedQueryResult<JobDTO[]>>>;
}

@injectable()
export class SearchJobImpl implements SearchJobs {
    constructor(
        @inject("JobRepository")
        private jobRepository: JobRepository
    ) {}

    async execute({ pagination, filter }: { pagination: any; filter: any; }): Promise<Either<Failure, PaginatedQueryResult<JobDTO[]>>> {
        return await this.jobRepository.searchJob({
            pagination,
            filter
        });
    }
}