import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { JobRepository } from "../../domain/jobRepository";

export interface DeleteJobForever {
    execute(payload: string): Promise<Either<Failure, void>>;
}

@injectable()
export class DeleteJobForeverImpl implements DeleteJobForever {
    constructor(
        @inject("JobRepository")
        private jobRepository: JobRepository
    ) {}

    async execute(payload: string): Promise<Either<Failure, void>> {
        return await this.jobRepository.deleteJobForever(payload);
    }
}