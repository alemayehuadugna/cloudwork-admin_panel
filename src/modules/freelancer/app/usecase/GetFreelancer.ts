import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Freelancer } from "../../domain/freelancer";
import { FreelancerRepository } from "../../domain/freelancerRepository";

export interface GetFreelancer {
    execute(payload: string): Promise<Either<Failure, Freelancer>>;
}

@injectable()
export class GetFreelancerImpl implements GetFreelancer {
    constructor(
        @inject("FreelancerRepository")
        private freelancerRepository: FreelancerRepository
    ) {}

    async execute(payload: string): Promise<Either<Failure, Freelancer>> {
        return await this.freelancerRepository.getFreelancer(payload);
    }
}
