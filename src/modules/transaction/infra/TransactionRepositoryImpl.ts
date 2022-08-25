import { Failure, ServerFailure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { Either, Left, Right } from "monet";
import { Transaction } from "../domain/transaction";
import { TransactionRepository } from "../domain/transactionRepository";
import request from "@/_core/utils/request";
import { TransactionMapper } from "./TransactionMapper";
import axios from "axios";
import { injectable } from "inversify";

@injectable()
export default class TransactionRepositoryImpl implements TransactionRepository {
	async approveTransaction(id: string): Promise<Either<Failure, Transaction>> {
		try {
			const response: any = await request.patch(`/transactions/approve/${id}`);
			return Right(TransactionMapper.toEntity(response));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}
			return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async holdTransaction(id: string): Promise<Either<Failure, Transaction>> {
		try {
			const response: any = await request.patch(`/transactions/hold/${id}`);
			return Right(TransactionMapper.toEntity(response));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}
			return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async cancelTransaction(id: string): Promise<Either<Failure, Transaction>> {
		try {
			const response: any = await request.patch(`/transactions/cancel/${id}`);
			return Right(TransactionMapper.toEntity(response));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}
			return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async listTransaction({ pagination, filter, sort }: any): Promise<Either<Failure, PaginatedQueryResult<Transaction[]>>> {
		try {
			console.log('repo pagination: ', filter);
			const response: any = await request({
				url: "/transactions",
				method: "GET",
				params: { ...pagination, filter, sort },
			});
			console.log("response: =>", response);

			return Right({
				data: TransactionMapper.toEntities(response.data),
				page: response.page
			});
		} catch (error) {
			console.log("catch error => ", error);
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}
			return Left(new ServerFailure("unexpected server failure "));
		}
	}
}