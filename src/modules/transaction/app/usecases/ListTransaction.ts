import { Failure } from "@/_core/error/failures";
import { Either } from "monet";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { Transaction } from "../../domain/transaction";
import { inject, injectable } from "inversify";
import { TransactionRepository } from "../../domain/transactionRepository";

export interface ListTransaction {
	execute({
		pagination,
		filter,
		sort,
	}: any): Promise<Either<Failure, PaginatedQueryResult<Transaction[]>>>;
}

@injectable()
export class ListTransactionImpl implements ListTransaction {
	constructor(
		@inject("TransactionRepository")
		private transactionRepository: TransactionRepository
	) { }

	async execute({ pagination, filter, sort }: any): Promise<Either<Failure, PaginatedQueryResult<Transaction[]>>> {
		return await this.transactionRepository.listTransaction({
			pagination,
			filter,
			sort
		});
	}
}