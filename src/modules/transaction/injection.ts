import { Container } from "inversify";
import { TransactionRepository } from "./domain/transactionRepository";
import TransactionRepositoryImpl from "./infra/TransactionRepositoryImpl";
import { ListTransaction, ListTransactionImpl } from "./app/usecases/ListTransaction";
import { ApproveTransaction, ApproveTransactionImpl } from "./app/usecases/ApproveTransaction";
import { CancelTransaction, CancelTransactionImpl } from "./app/usecases/CancelTransaction";
import { HoldTransaction, HoldTransactionImpl } from "./app/usecases/HoldTransaction";

export function injectTransaction(container: Container) {
	container
		.bind<TransactionRepository>("TransactionRepository")
		.to(TransactionRepositoryImpl)
		.inSingletonScope();
	container
		.bind<ListTransaction>("ListTransaction")
		.to(ListTransactionImpl)
		.inSingletonScope();
	container
		.bind<ApproveTransaction>("ApproveTransaction")
		.to(ApproveTransactionImpl)
		.inSingletonScope();
	container
		.bind<CancelTransaction>("CancelTransaction")
		.to(CancelTransactionImpl)
		.inSingletonScope();
	container
		.bind<HoldTransaction>("HoldTransaction")
		.to(HoldTransactionImpl)
		.inSingletonScope();
}