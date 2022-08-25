import { Failure, ServerFailure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import request from "@/_core/utils/request";
import { injectable } from "inversify";
import { Either, Left, Right } from "monet";
import { JobDTO, JobRepository } from "../domain/jobRepository";
import { JobMapper } from "./JobMapper";

@injectable()
export default class JobRepositoryImpl implements JobRepository {
	async findJobs({
		pagination,
		filter,
		sort,
	}: any): Promise<Either<Failure, PaginatedQueryResult<JobDTO[]>>> {
		try {
			const response: any = await request({
				url: "/jobs",
				method: "GET",
				params: { ...pagination, filter, sort },
			});
			return Right({
				data: JobMapper.toEntities(response.data),
				page: response.page,
			});
		} catch (ServerException) {
			return Left(new ServerFailure(""));
		}
	}
	async searchJob({
		pagination,
		filter,
	}: {
		pagination: any;
		filter: any;
	}): Promise<Either<Failure, PaginatedQueryResult<JobDTO[]>>> {
		try {
			const response: any = await request({
				url: "/jobs/search",
				method: "GET",
				params: { ...pagination, filter },
			});
			return Right({
				data: JobMapper.toEntities(response.data),
				page: response.page,
			});
		} catch (ServerException) {
			return Left(new ServerFailure(""));
		}
	}
	async deleteJob(id: string): Promise<Either<Failure, void>> {
		console.log("id in repo: ", id);
		try {
			await request({
				url: `/jobs/${id}`,
				method: "DELETE",
			});
			return Right(undefined);
		} catch (ServerException) {
			return Left(new ServerFailure(""));
		}
	}

	async deleteJobForever(id: string): Promise<Either<Failure, void>> {
		try {
			await request.delete(`/jobs/forEver/${id}`);
			return Right(undefined);
		} catch (ServerException) {
			return Left(new ServerFailure(""));
		}
	}
}
