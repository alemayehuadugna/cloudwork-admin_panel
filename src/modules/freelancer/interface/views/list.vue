<template>
	<div class="app-container">
		<el-row class="filter-container" type="flex" justify="space-between">
			<div class="filter-item">
				<el-input
					placeholder="Search"
					v-model="searchItem"
					style="width: 300px"
					@keyup.enter.native="
						searchItem === undefined || searchItem === ''
							? getList(query)
							: handleSearch()
					"
				/>
				<el-button
					style="margin-left: 5px"
					type="primary"
					icon="el-icon-search"
					@click="handleSearch"
				>
					Search
				</el-button>
			</div>
			<div class="filter-item">
				<el-button
					style="margin-left: 20px"
					type="primary"
					icon="el-icon-s-operation"
					@click="showFilterFrom"
				>
				</el-button>
			</div>
		</el-row>

		<el-form
			ref="form"
			label-width="120px"
			:inline="true"
			v-if="showFilter"
		>
			<el-form-item label="Expertise">
				<el-input
					v-model="filterOptions.expertise"
					style="max-width: 340px"
				></el-input>
			</el-form-item>
			<el-form-item label="Joined Between">
				<el-date-picker
					type="date"
					placeholder="Pick a Date"
					style="max-width: 140px; margin-right: 20px"
					v-model="dateJoinedFrom"
				></el-date-picker>
				<el-date-picker
					type="date"
					placeholder="Pick a Date"
					style="max-width: 140px; margin-right: 20px"
					v-model="dateJoinedTo"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="Gender" style="margin-right: 20px">
				<el-select
					v-model="filterOptions.gender"
					placeholder="Please select gender"
					style="margin-right: 20px"
				>
					<el-option label="Male" value="Male"></el-option>
					<el-option label="Female" value="Female"></el-option>
				</el-select>
				<el-checkbox
					label="Verified"
					v-model="filterOptions.verified"
				></el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-button-group>
					<el-button
						icon="el-icon-check"
						@click="handleFilter"
					></el-button>
					<el-button
						icon="el-icon-close"
						@click="clearFilterForm"
					></el-button>
				</el-button-group>
			</el-form-item>
		</el-form>

		<el-table
			:key="tableKey"
			v-loading="listLoading"
			:data="list"
			fit
			highlight-current-row
			style="width: 100%"
		>
			<el-table-column label="ID" align="center" min-width="80px">
				<template slot-scope="{ row }">
					<span>{{ row.freelancerId.slice(0, 7) }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Name" min-width="120px">
				<template slot-scope="{ row }">
					<span>{{ row.firstName + " " + row.lastName }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Gender" min-width="70px">
				<template slot-scope="{ row }">
					<span>{{ row.gender }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Phone" min-width="100px">
				<template slot-scope="{ row }">
					<span>{{ row.phone }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Email" min-width="150px">
				<template slot-scope="{ row }">
					<span>{{ row.email }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Date Joined" min-width="100px">
				<template slot-scope="{ row }">
					<span>{{ row.joinedDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Expertise" min-width="100px">
				<template slot-scope="{ row }">
					<span>{{ row.expertise }}</span>
				</template>
			</el-table-column>
			<el-table-column label="Verified" align="center" min-width="80px">
				<template slot-scope="{ row, $index }">
					<el-button
						v-if="row.verified === false"
						size="mini"
						plain
						@click="handleVerify(row.freelancerId, $index )"
					>
						Verify
					</el-button>
					<el-button
						type="success"
						v-if="row.verified === true"
						size="mini"
						plain
					>
						Verified
					</el-button>
				</template>
			</el-table-column>
			<el-table-column
				label="Actions"
				align="center"
				width="230"
				class-name="small-padding fixed-width"
			>
				<template slot-scope="{ row, $index }">
					<el-button
						type="warning"
						size="mini"
						v-if="row.state === 'DEACTIVATED'"
						style="margin-left: 10px"
						icon="el-icon-unlock"
						@click="
							handleDeactivate(row.freelancerId, $index, 'ACTIVE')
						"
					>
					</el-button>
					<el-button
						type="primary"
						size="mini"
						v-if="row.state === 'ACTIVE'"
						style="margin-left: 10px"
						icon="el-icon-lock"
						@click="
							handleDeactivate(
								row.freelancerId,
								$index,
								'DEACTIVATED'
							)
						"
					>
					</el-button>
					<el-button
						v-if="row.status != 'deleted'"
						size="mini"
						type="danger"
						icon="el-icon-delete-solid"
						@click="handleDelete(row, $index)"
					>
					</el-button>
				</template>
			</el-table-column>
		</el-table>

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
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import { FreelancerStore } from "@/modules/freelancer/interface/store/index";
import { FreelancerDTO } from "../../domain/freelancerRepository";
import Pagination from "@/_sharedKernel/components/Pagination/index.vue";

type FilterOptions = {
	expertise: undefined;
	gender: undefined;
	joinedBetween?: string[];
	verified: undefined;
};

@Component({
	name: "FreelancerTable",
	components: {
		Pagination,
	},
})
export default class extends Vue {
	private tableKey = 0;
	private list?: FreelancerDTO[] = [];
	private total = 0;
	private listLoading = false;

	private showFilter = false;
	private dateJoinedFrom: string = "";
	private dateJoinedTo: string = "";
	private searchItem = "";

	private filterOptions: FilterOptions = {
		expertise: undefined,
		gender: undefined,
		joinedBetween: undefined,
		verified: undefined,
	};

	private query: any = {
		pagination: { page: 1, limit: 8 },
		filter: undefined,
		sort: undefined,
	};

	created() {
		this.getList(this.query);
	}

	get freelancerStore(): FreelancerStore {
		return getModule(FreelancerStore, this.$store);
	}

	private async getList(query: any) {
		this.listLoading = true;

		await this.freelancerStore.listFreelancers(query);
		this.list = this.freelancerStore.freelancers;
		this.total = this.freelancerStore.page.totalElements;

		this.listLoading = false;
	}

	private clearFilterForm() {
		this.filterOptions.expertise = undefined;
		this.filterOptions.gender = undefined;
		this.filterOptions.joinedBetween = undefined;
		this.filterOptions.verified = undefined;
		this.dateJoinedFrom = "";
		this.dateJoinedTo = "";
	}

	private async handleSearch() {
		this.listLoading = true;

		this.query.filter = { searchItem: this.searchItem };
		await this.freelancerStore.searchForFreelancers(this.query);
		this.list = this.freelancerStore.freelancers;
		const page = this.freelancerStore.page;
		this.total = this.freelancerStore.page.totalElements;

		this.listLoading = false;
	}

	private handleFilter() {
		this.query.pagination.page = 1;
		this.query.filter = this.filterOptions;
		if (this.dateJoinedFrom && this.dateJoinedTo) {
			this.filterOptions.joinedBetween = [
				this.dateJoinedFrom,
				this.dateJoinedTo,
			];
		}
		this.getList(this.query);
	}

	private async handleDelete(row: any, index: number) {
		await this.freelancerStore.deleteFreelancer(row.freelancerId);
		this.list?.splice(index, 1);
	}

	private async handleVerify(freelancerId: string, index: number) {
		await this.freelancerStore.verityFreelancers({ freelancerId, index });
	}

	private showFilterFrom() {
		this.showFilter = !this.showFilter;
	}

	private async handleDeactivate(
		freelancerId: any,
		index: number,
		state: any
	) {
		await this.freelancerStore.deactivateFreelancer({
			freelancerId,
			index,
			state,
		});
	}
}
</script>