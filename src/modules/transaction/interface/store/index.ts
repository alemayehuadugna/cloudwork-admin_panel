import { lazyInject } from "@/_core/di/container";
import { ResultPage } from "@/_core/utils/CQRS";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { Transaction } from "../../domain/transaction";
import { ListTransaction } from "../../app/usecases/ListTransaction";
import { ApproveTransaction } from "../../app/usecases/ApproveTransaction";
import { CancelTransaction } from "../../app/usecases/CancelTransaction";
import { HoldTransaction } from "../../app/usecases/HoldTransaction";
import { Notification } from "element-ui";
import store from "@/_core/store";

export interface TransactionState {
	transactions: Transaction[];
	page: ResultPage;
}

@Module({
	dynamic: true,
	store,
	name: "transaction",
})
export class TransactionStore extends VuexModule implements TransactionState {
	transactions: Transaction[] = [];
	page: ResultPage = {
		pageSize: 10,
		current: 1,
		totalPages: 0,
		totalElements: 0,
		first: true,
		last: true,
	}

	@lazyInject("ListTransaction")
	private listTransactionUsecase!: ListTransaction;

	@lazyInject("ApproveTransaction")
	private approveTransactionUsecase!: ApproveTransaction;

	@lazyInject("CancelTransaction")
	private cancelTransactionUsecase!: CancelTransaction;

	@lazyInject("HoldTransaction")
	private holdTransactionUsecase!: HoldTransaction;

	@Mutation
	setTransactions(transactions: Transaction[]) {
		this.transactions = transactions;
	}

	@Mutation
	setPageResult(page: ResultPage) {
		this.page = page;
	}

	@Mutation
	updateTransactions(transaction: Transaction) {
		for (let i = 0; i < this.transactions.length; i++) {
			if (this.transactions[i].tnxId === transaction.tnxId) {
				this.transactions[i].status = transaction.status;
			}
		}
	}

	@Action({ rawError: true })
	async listTransactions(query: any) {
		const result = await this.listTransactionUsecase.execute(query);
		result.cata(
			(error) => {
				Notification({
					title: "Error",
					message: error.message,
					offset: 100,
					type: "error"
				});
			},
			(result) => {
				this.context.commit("setTransactions", result.data);
				this.context.commit("setPageResult", result.page);
			}
		);
	}

	@Action({ rawError: true })
	async approveTransaction(id: string) {
		const result = await this.approveTransactionUsecase.execute(id);
		result.cata(
			(error) => {
				Notification({
					title: "Error",
					message: error.message,
					offset: 100,
					type: "error"
				});
			},
			(transaction) => {
				this.context.commit("updateTransactions", transaction);
				Notification({
					title: "Success",
					message: "Transaction has been approved",
					offset: 100,
					type: "success"
				});
			}
		);
	}

	@Action({ rawError: true })
	async cancelTransaction(id: string) {
		const result = await this.cancelTransactionUsecase.execute(id);
		result.cata(
			(error) => {
				Notification({
					title: "Error",
					message: error.message,
					offset: 100,
					type: "error"
				});
			},
			(transaction) => {
				this.context.commit("updateTransactions", transaction);
				Notification({
					title: "Success",
					message: "Transaction has been Cancelled",
					offset: 100,
					type: "success"
				});
			}
		);
	}

	@Action({ rawError: true })
	async holdTransaction(id: string) {
		const result = await this.holdTransactionUsecase.execute(id);
		result.cata(
			(error) => {
				Notification({
					title: "Error",
					message: error.message,
					offset: 100,
					type: "error"
				});
			},
			(transaction) => {
				this.context.commit("updateTransactions", transaction);
				Notification({
					title: "Success",
					message: "Transaction has been held",
					offset: 100,
					type: "success"
				});
			}
		);
	}
}