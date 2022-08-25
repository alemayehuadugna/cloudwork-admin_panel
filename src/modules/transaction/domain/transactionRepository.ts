import { Either } from "monet";
import { Failure } from "@/_core/error/failures";
import { Transaction } from "./transaction";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";

interface TransactionRepository {
	approveTransaction(id: string): Promise<Either<Failure, Transaction>>;
	holdTransaction(id: string): Promise<Either<Failure, Transaction>>;
	cancelTransaction(id: string): Promise<Either<Failure, Transaction>>;
	listTransaction({ pagination, filter, sort }): Promise<Either<Failure, PaginatedQueryResult<Transaction[]>>>;
}

export { TransactionRepository };
