import { Failure, ServerFailure } from "@/_core/error/failures";
import request from "@/_core/utils/request";
import { injectable } from "inversify";
import { Either, Left, Right } from "monet";
import { Dashboard } from "../domain/dashboard";
import { DashboardRepository } from "../domain/dashboardRepository";

@injectable()
export default class DashboardRepositoryImpl implements DashboardRepository {
	async getAllCount(): Promise<Either<Failure, Dashboard>> {
		try {
			
			const response = await request.get('/counts');
			
			return Right({
				totalBalance: response.data.totalBalance,
				totalInvestmentBalance: response.data.totalInvestmentBalance,
				totalTransactionBalance: response.data.totalTransactionBalance,
				totalUsers: response.data.totalUsers,
				completedJobs: response.data.completedJobs,
				activeJobs: response.data.activeJobs,
			});
		} catch (e) {
			return Left(new ServerFailure('Error Getting Dashboard Data'))
		}
	}
}
