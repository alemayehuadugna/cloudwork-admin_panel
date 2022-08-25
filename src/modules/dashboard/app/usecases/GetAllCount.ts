import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Dashboard } from "../../domain/dashboard";
import { DashboardRepository } from "../../domain/dashboardRepository";

export interface GetAllCount {
	execute(): Promise<Either<Failure, Dashboard>>;
}

@injectable()
export class GetAllCountImpl implements GetAllCount {
	constructor(
		@inject("DashboardRepository")
		private dashboardRepository: DashboardRepository
	) { }
	async execute(): Promise<Either<Failure, Dashboard>> {
		console.log("Usecase Execute");
		return await this.dashboardRepository.getAllCount();
	}
}