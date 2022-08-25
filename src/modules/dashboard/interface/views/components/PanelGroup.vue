<template>
	<el-row :gutter="25" class="panel-group">
		<el-col :xs="24" :sm="24" :lg="8" class="card-panel-col">
			<div
				class="card-panel"
				@click="handleSetLineChartData('newVisitis')"
			>
				<div class="card-panel-icon-wrapper icon-people">
					<svg-icon name="users" class="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">Users</div>
					<count-to
						:start-val="0"
						:end-val="totalUsers"
						:duration="2600"
						class="card-panel-num"
					/>
				</div>
			</div>
		</el-col>
		<el-col :xs="24" :sm="24" :lg="8" class="card-panel-col">
			<div
				class="card-panel"
				@click="handleSetLineChartData('completedProjects')"
			>
				<div class="card-panel-icon-wrapper icon-message">
					<svg-icon name="briefcase" class="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">Completed Jobs</div>
					<count-to
						:start-val="0"
						:end-val="completedJobs"
						:duration="3000"
						class="card-panel-num"
					/>
				</div>
			</div>
		</el-col>
		<el-col :xs="24" :sm="24" :lg="8" class="card-panel-col">
			<div class="card-panel">
				<div class="card-panel-icon-wrapper icon-money">
					<svg-icon name="briefcase" class="card-panel-icon" />
				</div>
				<div class="card-panel-description">
					<div class="card-panel-text">Active Jobs</div>
					<count-to
						:start-val="0"
						:end-val="activeJobs"
						:duration="3200"
						class="card-panel-num"
					/>
				</div>
			</div>
		</el-col>
	</el-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CountTo from "vue-count-to";
import { DashboardStore } from "../../store";
import { getModule } from "vuex-module-decorators";

@Component({
	name: "PanelGroup",
	components: {
		CountTo,
	},
})
export default class extends Vue {
	@Prop() private completedJobs;
	@Prop() private activeJobs;
	@Prop() private totalUsers;
}
</script>

<style lang="scss" scoped>
.panel-group {
	margin-top: 18px;

	.card-panel-col {
		margin-bottom: 32px;
	}

	.card-panel {
		height: 108px;
		cursor: pointer;
		font-size: 12px;
		position: relative;
		overflow: hidden;
		color: #666;
		background: #fff;
		box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
		border-color: rgba(0, 0, 0, 0.05);

		&:hover {
			.card-panel-icon-wrapper {
				color: #fff;
			}

			.icon-people {
				background: #40c9c6;
			}

			.icon-message {
				background: #36a3f7;
			}

			.icon-money {
				background: #f4516c;
			}

			.icon-shopping {
				background: #34bfa3;
			}
		}

		.icon-people {
			color: #40c9c6;
		}

		.icon-message {
			color: #36a3f7;
		}

		.icon-money {
			color: #f4516c;
		}

		.icon-shopping {
			color: #34bfa3;
		}

		.card-panel-icon-wrapper {
			float: left;
			margin: 14px 0 0 14px;
			padding: 16px;
			transition: all 0.38s ease-out;
			border-radius: 6px;
		}

		.card-panel-icon {
			float: left;
			font-size: 48px;
		}

		.card-panel-description {
			float: right;
			font-weight: bold;
			margin: 26px;
			margin-left: 0px;

			.card-panel-text {
				line-height: 18px;
				color: rgba(0, 0, 0, 0.45);
				font-size: 16px;
				margin-bottom: 12px;
			}

			.card-panel-num {
				font-size: 20px;
			}
		}
	}
}

@media (max-width: 550px) {
	.card-panel-description {
		display: none;
	}

	.card-panel-icon-wrapper {
		float: none !important;
		width: 100%;
		height: 100%;
		margin: 0 !important;

		.svg-icon {
			display: block;
			margin: 14px auto !important;
			float: none !important;
		}
	}
}
</style>
