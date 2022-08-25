import { Transaction } from "../domain/transaction";

const TransactionMapper = {
	toEntity(json: any): Transaction {
		const transaction: Transaction = {
			tnxId: json.id.value,
			amount: json.amount,
			status: json.status,
			tnxFrom: json.tnxFrom,
			tnxBy: json.tnxBy,
			remark: json.remark,
			tnxTo: json.tnxTo,
			tnxType: json.tnxType,
			serviceCharge: json.serviceCharge,
			tnxNumber: json.tnxNumber,
			invoiceImageUrl: json.invoiceImageUrl,
			tnxTime: json.tnxTime,
		};
		return transaction;
	},
	toEntities(json: any): Transaction[] {
		const transactions: Transaction[] = json.map((entity: any) => {
			return this.toEntity(entity);
		});

		return transactions;
	}
};
// return ormEntities.map(e => this.toDomainEntity(e));
export { TransactionMapper };