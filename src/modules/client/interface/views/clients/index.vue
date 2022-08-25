<template>
  <div class="app-container">
    <el-row class="filter-container" type="flex" justify="space-between">
      <div class="filter-item">
        <el-input
          placeholder="Search"
          v-model="searchTerm"
          style="width: 300px"
          @keyup.enter.native="
            searchTerm === undefined || searchTerm === ''
              ? getList(query)
              : handleSearchClient()
          "
        />
        <el-button
          style="margin-left: 5px"
          type="primary"
          icon="el-icon-search"
          @click="handleSearchClient"
        >
          Search
        </el-button>
      </div>
      <div class="filter-item">
        <el-button
          style="margin-left: 20px"
          type="primary"
          icon="el-icon-s-operation"
          @click="showFilter = !showFilter"
        >
        </el-button>
      </div>
    </el-row>

    <el-form ref="form" label-width="120px" :inline="true" v-if="showFilter">
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
      <el-form-item style="margin-right: 20px">
        <el-checkbox
          label="Verified"
          v-model="filterOptions.verified"
        ></el-checkbox>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button
            icon="el-icon-check"
            @click="handleFilterClient"
          ></el-button>
          <el-button
            type="danger"
            style="margin-left: 5px"
            icon="el-icon-close"
            @click="clearFilterForm"
          ></el-button>
        </el-button-group>
      </el-form-item>
    </el-form>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="clients"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" align="center" min-width="80px">
        <template slot-scope="{ row }">
          <span>{{ row.clientId.slice(0, 7) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" min-width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.firstName + " " + row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Username" min-width="70px">
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
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
          <span>{{ row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Verified" align="center" min-width="80px">
        <template slot-scope="{ row, $index }">
          <el-button
            @click="verifyClient(row.clientId, $index )"
            v-if="row.verified === false"
            size="mini"
            plain
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
          <router-link :to="'clients/' + row.clientId">
            <el-button size="mini" icon="el-icon-view"> </el-button>
          </router-link>
          <el-button
            type="warning"
            size="mini"
            v-if="row.state === 'DEACTIVATED'"
            style="margin-left: 10px"
            icon="el-icon-unlock"
            @click="changeState(row.clientId, $index, 'ACTIVE')"
          >
          </el-button>
          <el-button
            type="primary"
            size="mini"
            v-if="row.state === 'ACTIVE'"
            style="margin-left: 10px"
            icon="el-icon-lock"
            @click="changeState(row.clientId, $index, 'DEACTIVATED')"
          >
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            icon="el-icon-delete-solid"
            @click="confirmDelete(row.clientId, $index)"
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

    <el-dialog
      title="Warning"
      :visible.sync="openDeleteDialog"
      width="25%"
      top="15%"

    >
      <span
        >Are You Sure to Delete?</span
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="openDeleteDialog = false">Cancel</el-button>
        <el-button type="primary" style="background: red; color: white; border: none" @click="handleDeleteClient"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";

import { ClientStore } from "@/modules/client/interface/store/index";
import { component } from "vue/types/umd";
import Pagination from "@/_sharedKernel/components/Pagination/index.vue";
import { ClientDTO } from "@/modules/client/domain/clientRepository";
import { Client } from "@/modules/client/domain/client";


type FilterOptions = {
	joinedBetween?: string[];
	verified: false;
};

@Component({
  name: "ClientTable",
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private listLoading = false;
  private showFilter = false;
  private searchTerm = "";
  private clients?: ClientDTO[] = [];
  private dateJoinedFrom: string = "";
	private dateJoinedTo: string = "";
  private openDeleteDialog = false;
  private selectedClient = {id: '', index: 0};
  private total = 0;
  private query: any = {
    pagination: { page: 1, limit: 10 },
    filter: undefined,
    sort: undefined,
  };
  private filterOptions: FilterOptions = {
    joinedBetween: undefined,
    verified: false,
  };

  @Watch("searchTerm")
  searchTermChanged(newValue: string){
    if(newValue.length === 0){
      this.searchTerm = "";
      this.getList(this.query);
    }
  }

  private clearFilterForm() {
		this.filterOptions.joinedBetween = undefined;
		this.filterOptions.verified = false;
		this.dateJoinedFrom = "";
		this.dateJoinedTo = "";
	}

  private confirmDelete(id: string, index: number) {
    this.openDeleteDialog = true;
    if(this.openDeleteDialog){
      this.selectedClient.id = id;
      this.selectedClient.index = index;
    }
    console.log(this.selectedClient);
  }

  created() {
    this.getList(this.query);
  }

  get clientStore(): ClientStore {
    return getModule(ClientStore, this.$store);
  }

  private async getList(query: any) {
    this.listLoading = true;
    await this.clientStore.listClients(query);
    this.clients = this.clientStore.clients;
    this.total = this.clientStore.page.totalElements;
    this.listLoading = false;
  }

  private async changeState(clientId: any, index: any, state: any) {
    await this.clientStore.changeClientState({ clientId, index, state });
  }

  private async handleDeleteClient() {
    if(this.selectedClient.id){
      await this.clientStore.deleteClient(this.selectedClient.id, this.selectedClient.index);
      this.openDeleteDialog = false;
    }

  }

   private handleFilterClient() {
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

  private async handleSearchClient() {
     this.listLoading = true;
    this.query.filter = {searchTerm: this.searchTerm};

    await this.clientStore.searchClients(this.query);
    this.clients = this.clientStore.clients;
    const page = this.clientStore.page;
    this.total = this.clientStore.page.totalElements;
    this.listLoading = false;
  }

  private async verifyClient(clientId: string, index: number){
    await this.clientStore.verifyClient({clientId, index});
  }
}
</script>