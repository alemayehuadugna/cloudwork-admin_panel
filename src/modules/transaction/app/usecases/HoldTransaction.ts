import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Failure } from "../../../../_core/error/failures";
import { Transaction } from "../../domain/transaction";
import { TransactionRepository } from "../../domain/transactionRepository";

export interface HoldTransaction {
	execute(payload: string): Promise<Either<Failure, Transaction>>
}

@injectable()
export class HoldTransactionImpl implements HoldTransaction {
	constructor(
		@inject("TransactionRepository")
		private transactionRepository: TransactionRepository
	) { }

	async execute(payload: string): Promise<Either<Failure, Transaction>> {
		return await this.transactionRepository.holdTransaction(payload);
	}
}