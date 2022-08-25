<template>
	<el-card shadow="never">
		<el-row>
			<el-row>
				<div
					style="
						margin: 0 auto;
						display: flex;
						align-items: center;
						justify-content: space-between;
						padding-bottom: 20px;
					"
				>
					<div>
						<el-row style="padding-bottom: 5px">
							<span style="font-size: 20px; font-weight: bold"
								>Welcome Back,</span
							>
						</el-row>

						<el-row>
							<span style="font-size: 14px">
								Cloudwork Admin Panel
							</span>
						</el-row>
					</div>
					<img
						style="width: 100px; height: 100px"
						class="img-circle"
						src="@/assets/profile.png"
					/>
				</div>
			</el-row>
			<el-row><el-divider direction="horizontal"></el-divider></el-row>
			<el-row>
				<div
					style="
						margin: 0 auto;
						display: flex;
						align-items: center;
						justify-content: space-between;
					"
				>
					<div style="padding-left: 10px">
						<svg-icon
							name="vault-solid"
							class="card-panel-icon icon-account"
							style="color: #53bf9d"
						/>
					</div>
					<div>
						<el-row style="padding-bottom: 5px">
							<span>Total Users Wallet Balance </span>
						</el-row>
						<el-row>
							<span
								class="card-panel-num"
								style="font-size: 20px; font-weight: bold"
								>{{ totalBalance }} ETB</span
							>
						</el-row>
					</div>
				</div>
			</el-row>
			<el-row><el-divider direction="horizontal"></el-divider></el-row>
			<el-row>
				<div
					style="
						margin: 0 auto;
						display: flex;
						align-items: center;
						justify-content: space-between;
					"
				>
					<div style="padding-left: 10px">
						<svg-icon
							name="coins"
							class="card-panel-icon icon-account"
							style="color: #47b5ff"
						/>
					</div>
					<div>
						<el-row style="padding-bottom: 5px">
							<span>Total Balance In Investment</span>
						</el-row>
						<el-row>
							<span
								class="card-panel-num"
								style="font-size: 20px; font-weight: bold"
								>{{  totalInvestment }} ETB</span
							>
						</el-row>
					</div>
				</div>
			</el-row>
			<el-row><el-divider direction="horizontal"></el-divider></el-row>
			<el-row>
				<div
					style="
						margin: 0 auto;
						display: flex;
						align-items: center;
						justify-content: space-between;
					"
				>
					<div style="padding-left: 10px">
						<svg-icon
							name="money-transfer"
							class="card-panel-icon icon-account"
							style="color: #bd4291"
						/>
					</div>
					<div>
						<el-row style="padding-bottom: 5px">
							<span>Total Balance In Transaction</span>
						</el-row>
						<el-row>
							<span
								class="card-panel-num"
								style="font-size: 20px; font-weight: bold"
								>{{ totalTransaction }} ETB</span
							>

						</el-row>
					</div>
				</div>
			</el-row>
			<el-row><el-divider direction="horizontal"></el-divider></el-row>
			<el-row>
				<div style="height: 120px"></div>
			</el-row>
		</el-row>
	</el-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import CountTo from "vue-count-to";

@Component({
	name: "TransactionTable",
	components: {
		CountTo,
	},
})
export default class extends Vue {
	@Prop() private totalBalance;
	@Prop() private totalInvestment;
	@Prop() private totalTransaction;
}
</script>

<style scoped>
.container {
	margin-bottom: 20;
}
.img-circle {
	border-radius: 50%;
	width: 50px;
	height: 50px;
	float: left;
}
.card-panel-icon {
	float: left;
	font-size: 48px;
	margin-right: 15px;
}
.card-panel-num {
	font-size: 20px;
}
</style>
