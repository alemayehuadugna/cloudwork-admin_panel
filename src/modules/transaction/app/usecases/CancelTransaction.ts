import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Transaction } from "../../domain/transaction";
import { TransactionRepository } from "../../domain/transactionRepository";

export interface CancelTransaction {
	execute(payload: string): Promise<Either<Failure, Transaction>>;
}

@injectable()
export class CancelTransactionImpl implements CancelTransaction {
	constructor(
		@inject("TransactionRepository")
		private transactionRepository: TransactionRepository
	) {}

	async execute(payload: string): Promise<Either<Failure, Transaction>> {
		return await this.transactionRepository.cancelTransaction(payload);
	}
}