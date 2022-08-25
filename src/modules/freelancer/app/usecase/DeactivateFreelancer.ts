import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { FreelancerRepository } from "../../domain/freelancerRepository";

type Params = {
	freelancerId: string;
	state: "ACTIVE" | "DEACTIVATE";
}

export interface DeactivateFreelancer {
	execute(payload: Params): Promise<Either<Failure, void>>;
}

@injectable()
export class DeactivateFreelancerImpl implements DeactivateFreelancer {
	constructor(
		@inject("FreelancerRepository")
		private freelancerRepository: FreelancerRepository
	) { }

	async execute(payload: Params): Promise<Either<Failure, void>> {
		return await this.freelancerRepository.deactivateFreelancer(payload);
	}
}
