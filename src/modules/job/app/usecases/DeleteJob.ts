import { injectUser } from "@/modules/user/injection";
import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { JobRepository } from "../../domain/jobRepository";

export interface DeleteJob {
    execute(id: string): Promise<Either<Failure, void>>;
}

@injectable()
export class DeleteJobImpl implements DeleteJob {
    constructor(
        @inject("JobRepository")
        private jobRepository: JobRepository
    ) {}

    async execute(id: string): Promise<Either<Failure, void>> {
        return await this.jobRepository.deleteJob(id);
    }
}