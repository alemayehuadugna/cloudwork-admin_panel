import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import {
	FreelancerDTO,
	FreelancerRepository,
} from "../../domain/freelancerRepository";

export interface ListFreelancers {
	execute({
		pagination,
		filter,
		sort,
	}: any): Promise<Either<Failure, PaginatedQueryResult<FreelancerDTO[]>>>;
}

@injectable()
export class ListFreelancersImpl implements ListFreelancers {
	constructor(
		@inject("FreelancerRepository")
		private freelancerRepository: FreelancerRepository
	) { }
	async execute({
		pagination,
		filter,
		sort,
	}: any): Promise<Either<Failure, PaginatedQueryResult<FreelancerDTO[]>>> {
		return await this.freelancerRepository.findFreelancers({
			pagination,
			filter,
			sort,
		});
	}
}
