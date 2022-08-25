import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { FreelancerDTO, FreelancerRepository } from "../../domain/freelancerRepository";

export interface SearchFreelancers {
	execute({
		pagination,
		filter
	}): Promise<Either<Failure, PaginatedQueryResult<FreelancerDTO[]>>>;
}

@injectable()
export class SearchFreelancersImpl implements SearchFreelancers {
	constructor(
		@inject("FreelancerRepository")
		private freelancerRepository: FreelancerRepository
	) { }

	async execute({ pagination, filter }: { pagination: any; filter: any; }): Promise<Either<Failure, PaginatedQueryResult<FreelancerDTO[]>>> {
		return await this.freelancerRepository.searchForFreelancer({
			pagination,
			filter
		});
	}
}