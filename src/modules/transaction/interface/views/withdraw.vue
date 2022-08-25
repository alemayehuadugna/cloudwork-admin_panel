<template>
	<div class="tab-container">
		<h3 class="page-title">Withdrawals</h3>
		<el-tabs
			v-model="activeName"
			style="margin-top: 15px"
		>
			<el-tab-pane
				v-for="item in tabMapOptions"
				:key="item.key"
				:label="item.label"
				:name="item.key"
			>
				<keep-alive>
					<tab-pane
						v-if="activeName === item.key"
						:type="item.key"
						page="withdraw"
					/>
				</keep-alive>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import TabPane from "./components/TabPane.vue";

@Component({
	name: "Withdraw",
	components: {
		TabPane,
	},
})
export default class extends Vue {
	private tabMapOptions = [
		{ label: "History", key: "history" },
		{ label: "Pending", key: "pending" },
		{ label: "Cancelled", key: "cancelled" },
		{ label: "Completed", key: "completed" },
	];

	private activeName = "history";
	private createdTimes = 0;

	@Watch("activeName")
	private onActiveNameChange(value: string) {
		this.$router.push(`${this.$route.path}?tab=${value}`).catch((err) => {
			console.warn(err);
		});
	}

	created() {
		// Init the default selected tab
		const tab = this.$route.query.tab as string;
		if (tab) {
			this.activeName = tab;
		}
	}

	private showCreatedTimes() {
		this.createdTimes = this.createdTimes + 1;
	}
}
</script>

<style lang="scss" scoped>
.tab-container {
	margin: 30px;
}
.page-title {
    font-size: 24px;
    font-weight: 600;
    color: #131523;
    margin-bottom: 5px;
    font-family: 'Source Sans Pro', sans-serif;
}
</style>
