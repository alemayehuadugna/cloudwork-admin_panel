export interface Transaction {
	tnxId: string;
	amount: number;
	status: string;
	tnxFrom: string;
	tnxBy: string;
	remark?: string;
	tnxTo: string;
	tnxType: string;
	serviceCharge: number;
	tnxNumber: string;
	invoiceImageUrl: string;
	tnxTime: Date;
}