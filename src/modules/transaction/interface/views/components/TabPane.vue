<template>
	<div>
		<el-table
			v-loading="loading"
			:data="list"
			fit
			style="width: 100%"
			highlight-current-row
		>
			<el-table-column align="center" label="ID" width="100">
				<template slot-scope="{ row }">
					<span>{{ row.tnxId.slice(0, 7) }}</span>
				</template>
			</el-table-column>

			<el-table-column align="start" label="Tnx Type" min-width="120">
				<template slot-scope="{ row }">
					<span class="tnx-type">{{ row.tnxType }}</span>
				</template>
			</el-table-column>

			<el-table-column min-width="180px" align="start" label="Tnx Time">
				<template slot-scope="{ row }">
					<span>{{ formatDate(row.tnxTime) }}</span>
					<!-- <span>{{ row.tnxTime }}</span> -->
				</template>
			</el-table-column>

			<el-table-column min-width="180px" align="start" label="Tnx By">
				<template slot-scope="{ row }">
					<span>{{ row.tnxBy.transferredThrough }}</span>
				</template>
			</el-table-column>

			<el-table-column min-width="120px" align="start" label="Amount">
				<template slot-scope="{ row }">
					<span v-if="row.tnxType === 'Withdraw'" class="text-danger">
						- {{ row.amount }} ETB
					</span>
					<span v-if="row.tnxType === 'Deposit'" class="text-success">
						+ {{ row.amount }} ETB
					</span>
				</template>
			</el-table-column>

			<el-table-column
				class-name="status-col"
				align="start"
				label="Status"
				min-width="160"
			>
				<template slot-scope="{ row }">
					<el-tag v-if="row.status === 'Completed'" type="success">
						{{ row.status }}
					</el-tag>
					<el-tag v-if="row.status === 'Pending'" type="warning">
						{{ row.status }}
					</el-tag>
					<el-tag v-if="row.status === 'Cancelled'" type="danger">
						{{ row.status }}
					</el-tag>
					<el-tag v-if="row.status === 'OnHold'" type="info">
						On Hold
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column min-width="50px" align="start" fixed="right">
				<template slot-scope="{ row }">
					<el-dropdown @command="handleCommand">
						<span class="el-dropdown-link">
							<i class="el-icon-more el-icon--left"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								icon="el-icon-view"
								:command="{
									action: 'view',
									transaction: row,
								}"
							>
								View Details
							</el-dropdown-item>
							<el-dropdown-item
								icon="el-icon-circle-check"
								:command="{
									action: 'approve',
									id: row.tnxId,
								}"
							>
								Approve
							</el-dropdown-item>
							<el-dropdown-item
								icon="el-icon-video-pause"
								:command="{
									action: 'hold',
									id: row.tnxId,
								}"
							>
								Hold
							</el-dropdown-item>
							<el-dropdown-item
								icon="el-icon-circle-close"
								:command="{
									action: 'cancel',
									id: row.tnxId,
								}"
							>
								Cancel
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog
			title="Warning"
			:visible.sync="showDetailDialog"
			width="30%"
			center
		>
			<span>{{ selectedTransaction }}</span>
		</el-dialog>

		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="query.pagination.page"
			:limit.sync="query.pagination.limit"
			@pagination="getList"
		/>
	</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Pagination from "@/_sharedKernel/components/Pagination/index.vue";
import { Transaction } from "@/modules/transaction/domain/transaction";
import { TransactionStore } from "../../store/index";
import { getModule } from "vuex-module-decorators";
import dayjs from "dayjs";

type FilterOption = {
	status: undefined | string;
	tnxBy: undefined;
	tnxType: undefined | string;
	amountBetween?: number[];
};

@Component({
	name: "TabPane",
	components: {
		Pagination,
	},
})
export default class extends Vue {
	@Prop() private type!: string;
	@Prop() private page!: string;

	private list?: Transaction[] = [];
	private total = 0;
	private loading = false;

	private showFilter = false;
	private showDetailDialog = false;
	private selectedTransaction: Transaction | null = null;

	private filterOptions: FilterOption = {
		status: undefined,
		tnxBy: undefined,
		tnxType: undefined,
		amountBetween: undefined,
	};

	private query: any = {
		pagination: { page: 1, limit: 10 },
		filter: undefined,
		sort: undefined,
	};

	get transactionStore(): TransactionStore {
		return getModule(TransactionStore, this.$store);
	}

	created() {
		this.getList(this.query);
	}

	private formatDate(date: Date) {
		return dayjs(date).format("YYYY/MM/DD");
	}

	private async handleCommand(command) {
		switch (command.action) {
			case "view":
				this.showDetailDialog = true;
				this.selectedTransaction = command.transaction;
				break;
			case "approve":
				await this.transactionStore.approveTransaction(command.id);
				this.list = this.transactionStore.transactions;
				this.total = this.transactionStore.page.totalElements;
				break;
			case "hold":
				await this.transactionStore.holdTransaction(command.id);
				break;
			case "cancel":
				await this.transactionStore.cancelTransaction(command.id);
				break;
		}
	}

	private transactionFilterOptions() {
		switch (this.type) {
			case "all":
				break;
			case "deposit":
				this.filterOptions.tnxType = "Deposit";
				break;
			case "withdraw":
				this.filterOptions.tnxType = "Withdraw";
				break;
			case "pending":
				this.filterOptions.status = "Pending";
				break;
			case "hold":
				this.filterOptions.status = "OnHold";
				break;
			case "completed":
				this.filterOptions.status = "Completed";
				break;
		}
	}

	private depositFilterOptions() {
		switch (this.type) {
			case "history":
				this.filterOptions.tnxType = "Deposit";
				break;
			case "pending":
				this.filterOptions.tnxType = "Deposit";
				this.filterOptions.status = "Pending";
				break;
			case "hold":
				this.filterOptions.tnxType = "Deposit";
				this.filterOptions.status = "OnHold";
				break;
			case "cancelled":
				this.filterOptions.tnxType = "Deposit";
				this.filterOptions.status = "Cancelled";
				break;
			case "completed":
				this.filterOptions.tnxType = "Deposit";
				this.filterOptions.status = "Completed";
				break;
			default:
				break;
		}
	}

	private withdrawFilterOptions() {
		switch (this.type) {
			case "history":
				this.filterOptions.tnxType = "Withdraw";
				break;
			case "pending":
				this.filterOptions.tnxType = "Withdraw";
				this.filterOptions.status = "Pending";
				break;
			case "cancelled":
				this.filterOptions.tnxType = "Withdraw";
				this.filterOptions.status = "Cancelled";
				break;
			case "completed":
				this.filterOptions.tnxType = "Withdraw";
				this.filterOptions.status = "Completed";
				break;
		}
	}

	private async getList(query: any) {
		this.loading = true;
		console.log("page is => ", this.page);
		if (this.page === "transaction") {
			this.transactionFilterOptions();
		} else if (this.page === "deposit") {
			this.depositFilterOptions();
		} else if (this.page === "withdraw") {
			this.withdrawFilterOptions();
		}
		this.query.filter = this.filterOptions;
		await this.transactionStore.listTransactions(this.query);
		this.list = this.transactionStore.transactions;
		this.total = this.transactionStore.page.totalElements;

		this.loading = false;
	}
}
</script>

<style scoped>
.text-danger {
	color: #ef3737 !important;
}
.text-success {
	color: #22cc62 !important;
}
.tnx-type {
	font-weight: bold;
}
.el-dropdown-link {
	cursor: pointer;
	color: #409eff;
}
.el-icon-arrow-down {
	font-size: 12px;
}
</style>