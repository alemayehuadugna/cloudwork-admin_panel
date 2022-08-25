import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { FreelancerRepository } from "../../domain/freelancerRepository";

export interface VerifyFreelancer {
	execute(payload: string): Promise<Either<Failure, void>>;
}

@injectable()
export class VerifyFreelancerImpl implements VerifyFreelancer {
	constructor(
		@inject('FreelancerRepository')
		private freelancerRepository: FreelancerRepository
	) {

	}
	async execute(payload: string): Promise<Either<Failure, void>> {
		return await this.freelancerRepository.verifyFreelancer(payload);
	}
}