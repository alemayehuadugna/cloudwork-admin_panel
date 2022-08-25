<template>
	<div class="dashboard-editor-container">
		<el-col
			:xs="{ span: 24 }"
			:sm="{ span: 24 }"
			:md="{ span: 24 }"
			:lg="{ span: 16 }"
			:xl="{ span: 16 }"
			style="padding-right: 8px; margin-bottom: 30px"
		>
			<el-row>
				<panel-group
					:activeJobs="dashboards.activeJobs"
					:completedJobs="dashboards.completedJobs"
					:totalUsers="dashboards.totalUsers"
				/>
			</el-row>
			<el-row
				style="
					background: #fff;
					padding: 16px 16px 0;
					margin-bottom: 32px;
				"
			>
				<transaction />
			</el-row>
		</el-col>
		<el-col
			:xs="{ span: 24 }"
			:sm="{ span: 24 }"
			:md="{ span: 24 }"
			:lg="{ span: 8 }"
			:xl="{ span: 8 }"
			style="padding-right: 8px; margin-bottom: 30px"
		>
			<div :data="list" style="width: 100%; padding-top: 15px"></div>

			<welcome-back
				:totalBalance="dashboards.totalBalance"
				:totalInvestment="dashboards.totalInvestmentBalance"
				:totalTransaction="dashboards.totalTransactionBalance"
			/>
		</el-col>

		<el-row> </el-row>
	</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import PanelGroup from "../views/components/PanelGroup.vue";

import { getModule } from "vuex-module-decorators";
import WelcomeBack from "./components/WelcomeBack.vue";
import Account from "@/modules/user/interface/views/profile/components/Account.vue";
import TabPane from "@/modules/transaction/interface/views/components/TabPane.vue";
import Transaction from "@/modules/transaction/interface/views/transaction.vue";
import { DashboardStore } from "../store/index";

@Component({
	name: "DashboardAdmin",
	components: {
		PanelGroup,
		WelcomeBack,
		Account,
		TabPane,
		Transaction,
	},
})
export default class extends Vue {
	private dashboards?: any = {};

	get dashboardStore(): DashboardStore {
		return getModule(DashboardStore, this.$store);
	}

	private async getAllCount() {
		await this.dashboardStore.getAllCount();
		this.dashboards = this.dashboardStore.dashboards;
	}

	created() {
		this.getAllCount();
	}
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
	padding: 16px;
	background-color: rgb(240, 242, 245);
	position: relative;

	.chart-wrapper {
		background: #fff;
		padding: 16px 16px 0;
		margin-bottom: 32px;
	}
}
@media (max-width: 1024px) {
	.chart-wrapper {
		padding: 8px;
	}
}
</style>
