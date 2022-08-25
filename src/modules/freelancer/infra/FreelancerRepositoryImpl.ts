import { Failure, ServerFailure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import request from "@/_core/utils/request";
import { injectable } from "inversify";
import { Either, Left, Right } from "monet";
import { Freelancer } from "../domain/freelancer";
import {
	FreelancerDTO,
	FreelancerRepository,
} from "../domain/freelancerRepository";
import { FreelancerMapper } from "./FreelancerMapper";
import axios from "axios";

@injectable()
export default class FreelancerRepositoryImpl implements FreelancerRepository {
	async verifyFreelancer(id: string): Promise<Either<Failure, void>> {
		try {
			const response: any = await request.patch(`/freelancers/identify-verify/${id}`);
			return Right(undefined);
		} catch (e) {
			if (axios.isAxiosError(e)) {
                return Left(new ServerFailure(e.response?.data.error));
            }
            return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async findFreelancers({
		pagination,
		filter,
		sort,
	}: any): Promise<Either<Failure, PaginatedQueryResult<FreelancerDTO[]>>> {
		console.log("filter data", filter);
		try {
			const response: any = await request({
				url: "/freelancers",
				method: "GET",
				params: { ...pagination, filter, sort },
			});
			return Right({
				data: FreelancerMapper.toEntities(response.data),
				page: response.page,
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}
			return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async getFreelancer(id: string): Promise<Either<Failure, Freelancer>> {
		try {
			const response: any = await request.get(`/freelancers/${id}`);

			return Right(FreelancerMapper.toEntity(response.data));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}
			return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async deleteFreelancer(id: string): Promise<Either<Failure, void>> {
		try {
			await request.delete(`/freelancers/${id}`);
			return Right(undefined);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}
			return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async deactivateFreelancer({ freelancerId, state }: any): Promise<Either<Failure, void>> {
		try {
			await request.patch(`/freelancers/${freelancerId}/state`, { state: state });
			return Right(undefined);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}
			return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async searchForFreelancer({ pagination, filter }): Promise<Either<Failure, PaginatedQueryResult<FreelancerDTO[]>>> {
		console.log("filter in repo: ", filter);
		try {
			const response: any = await request({
				url: "/freelancers/search",
				method: "GET",
				params: { ...pagination, filter }
			});
			return Right({
				data: FreelancerMapper.toEntities(response.data),
				page: response.page
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}
			return Left(new ServerFailure("unexpected server failure"));
		}
	}
}
