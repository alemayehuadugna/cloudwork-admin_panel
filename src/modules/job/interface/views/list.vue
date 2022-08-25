<template>
  <div>
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
          <el-form-item label="Experience">
            <el-input
              v-model="filterOptions.experience"
              style="max-width: 340px"
            ></el-input>
          </el-form-item>
          <el-form-item label="Start Between">
            <el-date-picker
              type="date"
              placeholder="Pick a Date"
              style="max-width: 140px; margin-right: 20px"
              v-model="startDateFrom"
            ></el-date-picker>
            <el-date-picker
              type="date"
              placeholder="Pick a Date"
              style="max-width: 140px; margin-right: 20px"
              v-model="startDateTo"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button
                icon="el-icon-check"
                @click="handleFilter('ALL')"
              ></el-button>
              <el-button
                icon="el-icon-close"
                @click="clearFilterForm"
              ></el-button>
            </el-button-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="filter-container">
        <el-row type="flex">
          <el-button
            style="width: 25%; border: 0"
            :type="type1"
            @click="
              (type1 = 'warning'),
                (type2 = ''),
                (type3 = ''),
                (type4 = ''),
                handleFilter('ALL')
            "
            >All</el-button
          >
          <el-button
            style="width: 25%; border: 0"
            :type="type2"
            class="btn"
            @click="
              (type2 = 'warning'),
                (type1 = ''),
                (type3 = ''),
                (type4 = ''),
                handleFilter('ACTIVE')
            "
            >Active</el-button
          >
          <el-button
            style="width: 25%; border: 0"
            :type="type3"
            class="btn"
            @click="
              (type3 = 'warning'),
                (type1 = ''),
                (type2 = ''),
                (type4 = ''),
                handleFilter('INACTIVE')
            "
            >In Active</el-button
          >
          <el-button
            style="width: 25%; border: 0"
            :type="type4"
            class="btn"
            @click="
              (type4 = 'warning'),
                (type1 = ''),
                (type2 = ''),
                (type3 = ''),
                handleFilter('DELETED')
            "
            >Trash</el-button
          >
        </el-row>
      </div>

      <div class="app-container">
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="ID" align="center" min-width="80px">
            <template slot-scope="{ row }">
              <span>{{ row.jobId.slice(0, 7) }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Logo" align="center" min-width="80px">
            <template slot-scope="{ row }">
              <span>{{ row.logo }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Title" align="center" min-width="80px">
            <template slot-scope="{ row }">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Budget" align="center" min-width="80px">
            <template slot-scope="{ row }">
              <span>{{ row.budget }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Progress" align="center" min-width="80px">
            <template slot-scope="{ row }">
              <span>{{ row.progress }}</span>
            </template>
          </el-table-column>

          <el-table-column label="StartDate" align="center" min-width="80px">
            <template slot-scope="{ row }">
              <span>{{ row.startDate }}</span>
            </template>
          </el-table-column>

          <el-table-column label="Due Date" align="center" min-width="80px">
            <template slot-scope="{ row }">
              <span>{{ row.expiry }}</span>
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
                v-if="row.progress != 'DELETED'"
                size="mini"
                type="danger"
                @click="handleDelete(row, $index)"
              >
                Delete
              </el-button>

              <el-button
                v-if="row.progress === 'DELETED'"
                size="mini"
                type="danger"
                @click="handleDeleteForever(row, $index)"
              >
                DeleteForever
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { getModule } from "vuex-module-decorators";
import { JobDTO } from "../../domain/jobRepository";
import { JobStore } from "../store";
import Pagination from "@/_sharedKernel/components/Pagination/index.vue";

type FilterOptions = {
  experience: undefined;
  startDateBetween?: string[];
  progress?: string;
};

@Component({
  name: "JobTable",
  components: {
    Pagination
  },
})
export default class extends Vue {
  private type1: string = "warning";
  private type2: string = "";
  private type3: string = "";
  private type4: string = "";
  private payload: any = {};

  private tableKey = 0;
  private list?: JobDTO[] = [];
  private total = 0;
  private listLoading = false;

  private showFilter = false;
  private startDateFrom: string = "";
  private startDateTo: string = "";
  private searchItem = "";

  private filterOptions: FilterOptions = {
    experience: undefined,
    startDateBetween: undefined,
    progress: undefined,
  };

  private query: any = {
    pagination: { page: 1, limit: 8 },
    filter: undefined,
    sort: undefined,
  };

  created() {
    this.getList(this.query);
  }

  get jobStore(): JobStore {
    return getModule(JobStore, this.$store);
  }

  private async getList(query: any) {
    console.log("jobs length: ", this.jobStore.jobs.length);
    this.listLoading = true;

    if (
      this.jobStore.jobs.length > 0 ||
      this.filterOptions.progress === "ALL" ||
      this.filterOptions.progress === "ACTIVE" ||
      this.filterOptions.progress === "INACTIVE" ||
      this.filterOptions.progress === "DELETED"
    ) {
      console.log("job in store");
      if (this.filterOptions.progress) {
        console.log("filterOption: ", this.filterOptions.progress);
        if (this.filterOptions.progress === "ALL") {
          this.filterOptions.progress = undefined;
          this.query.filter = this.filterOptions;
        }
        this.payload = {
          query: query,
          type1: this.type1,
          type2: this.type2,
          type3: this.type3,
          type4: this.type4,
        };
        await this.jobStore.listJobs(this.payload);
        this.list = this.jobStore.jobs;
        const page = this.jobStore.page;
        this.total = this.jobStore.page.totalElements;
        console.log(
          "job in store but progress exists and type is: ",
          this.jobStore.type2
        );

        this.listLoading = false;

        this.filterOptions.progress = undefined;
      } else {
        if (this.jobStore.type1) {
          this.type1 = this.jobStore.type1;
          this.type2 = "";
          this.type3 = "";
          this.type4 = "";
        } else if (this.jobStore.type2) {
          this.type1 = "";
          this.type2 = this.jobStore.type2;
          this.type3 = "";
          this.type4 = "";
        } else if (this.jobStore.type3) {
          this.type1 = "";
          this.type2 = "";
          this.type3 = this.jobStore.type3;
          this.type4 = "";
        } else if (this.jobStore.type4) {
          this.type1 = "";
          this.type2 = "";
          this.type3 = "";
          this.type4 = this.jobStore.type4;
        }
        console.log("jobs in store again: ", this.jobStore.jobs);
        this.list = this.jobStore.jobs;
        const page = this.jobStore.page;
        this.total = this.jobStore.page.totalElements;

        this.listLoading = false;
      }
    } else {
      this.payload = {
        query: query,
        type1: this.type1,
        type2: this.type2,
        type3: this.type3,
        type4: this.type4,
      };
      console.log("no jobs in store and type1 is: ", this.payload.type1);
      await this.jobStore.listJobs(this.payload);
      this.list = this.jobStore.jobs;
      const page = this.jobStore.page;
      this.total = this.jobStore.page.totalElements;

      this.listLoading = false;
    }
  }

  private clearFilterForm() {
    this.filterOptions.experience = undefined;
    this.filterOptions.startDateBetween = undefined;
    this.startDateFrom = "";
    this.startDateTo = "";
  }

  private async handleSearch() {
    this.listLoading = true;
    this.query.filter = { searchItem: this.searchItem };
    await this.jobStore.searchJobs(this.query);
    this.list = this.jobStore.jobs;
    const page = this.jobStore.page;
    this.total = this.jobStore.page.totalElements;

    this.listLoading = false;
  }
  private handleFilter(progress: string) {
    this.query.pagination.page = 1;
    if (progress === "ALL") {
      this.filterOptions.progress = "ALL";
    } else {
      this.filterOptions.progress = progress;
    }
    if (this.startDateFrom && this.startDateTo) {
      this.filterOptions.startDateBetween = [
        this.startDateFrom,
        this.startDateTo,
      ];
    }
    this.query.filter = this.filterOptions;
    this.getList(this.query);
  }

  private async handleDelete(row: any, index: number) {
    await this.jobStore.deleteJob(row.jobId);
    const page = this.jobStore.page.totalElements;
    this.total = page;
    this.$notify({
      title: "Success",
      message: "Deleted Successfully",
      type: "success",
      duration: 2000,
    });
    row.progress = "DELETED";
  }

  private showFilterFrom() {
    this.showFilter = !this.showFilter;
  }

  private async handleDeleteForever(row: any, index: number) {
    await this.jobStore.deleteJobForever(row.jobId);
    this.list?.splice(index, 1);
  }
}
</script>

<style scoped>
.title-container {
  margin-left: 30px;
  margin-top: 20px;
  font-size: 18px;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: bold;
}
.title {
  margin-top: 5px;
}
</style>