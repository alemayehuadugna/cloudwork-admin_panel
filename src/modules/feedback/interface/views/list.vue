<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.filter.title"
        placeholder="Title"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="fetchFeedbacks"
      />
      <el-input
        v-model="listQuery.filter.firstName"
        placeholder="First Name"
        style="width: 200px; margin-right: 10px"
        class="filter-item"
        @keyup.enter.native="fetchFeedbacks"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="fetchFeedbacks"
      >
        Filter
      </el-button>
    </div>

    <!-- <div>
      <el-input v-model="search" size="small" placeholder="Type to search" />
    </div> -->

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="feedbacks"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" prop="id" align="center" width="220px" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ formatId(row.id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Full Name" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.firstName + " " + row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Title" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Message" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.message }}</span>
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
            size="mini"
            @click="handleViewFeedback(row)"
            type="primary"
            icon="el-icon-view"
          ></el-button>
          <el-button
            v-if="row.state !== 'DELETED'"
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="confirm(row.id, $index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-show="totalFeedback > 0"
      :total="totalFeedback"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="fetchFeedbacks"
    />

    <el-dialog title="Edit" :visible.sync="openDialog" width="30%">
      <el-form ref="dataForm" :model="feedback" class="create-form">
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model="feedback.firstName" />
        </el-form-item>
        <el-form-item label="Last Name" prop="lastName">
          <el-input v-model="feedback.lastName" />
        </el-form-item>
        <el-form-item label="Title" prop="phone">
          <el-input v-model="feedback.title" />
        </el-form-item>
        <el-form-item label="Message" prop="email">
          <el-input v-model="feedback.message" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="openDialog = false"> Cancel </el-button>
      </div>
    </el-dialog>

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
        <el-button type="primary" style="background: red; color: white; border: none" @click="handleDeleteFeedback"
          >Confirm</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { GetFeedbacks } from "@/modules/feedback/app/usecases/GetFeedbacks";
import { lazyInject } from "@/_core/di/container";
import { Component, Vue, Watch } from "vue-property-decorator";
import Pagination from "@/_sharedKernel/components/Pagination/index.vue";
import { Feedback } from "@/modules/feedback/domain/feedback";
import { ListQuery } from "@/modules/feedback/domain/feedbackRepository";
import { DeleteFeedback } from "@/modules/feedback/app/usecases/DeleteFeedback";

@Component({
  name: "feedbacks",
  components: {
    Pagination,
  },
})
export default class extends Vue {
  @lazyInject("GetFeedbacks") private getFeedbacks!: GetFeedbacks;
  @lazyInject("DeleteFeedback") private deleteFeedback!: DeleteFeedback;

  public feedbacks?: Feedback[] = [];
  private feedbackData = { id: "", index: 0 }
  private totalFeedback?: number;

  public tableKey = 0;
  public listLoading = false;
  public search = "";
  private openDialog = false;
  private openDeleteDialog = false;

  public listQuery: ListQuery = {
    page: 1,
    limit: 10,
    sort: "-firstName",
    filter: {
      title: undefined,
      firstName: undefined,
    },
  };

@Watch("listQuery.filter.title")
  titleChanged(newVal: string) {
    if (newVal.length === 0) {
      this.listQuery.filter.title = undefined;
      this.fetchFeedbacks();
    }
}

@Watch("listQuery.filter.firstName")
  firstNameChanged(newVal: string) {
    if (newVal.length === 0) {
      this.listQuery.filter.firstName = undefined;
      this.fetchFeedbacks();
    }
  }

  private feedback: any = {};

  getFilteredData() {
    console.log("object");
  }

  public formatId(id: string) {
    return id.slice(0, 5);
  }

  private confirm(id: string, index: number) {
    this.openDeleteDialog = true;
    if (this.openDeleteDialog) {
      this.feedbackData.id = id;
      this.feedbackData.index = index;
    }
  }

  public async handleDeleteFeedback() {
    if (this.feedbackData.id) {
      const deleteFeedback = await this.deleteFeedback.execute(this.feedbackData.id);
      deleteFeedback.cata(
        (failure) => {
          console.log(failure);
        },
        (feedbacks: any) => {
          this.$notify({
            title: "Success",
            message: "Delete Successfully",
            type: "success",
            duration: 2000,
          });

          this.feedbacks?.splice(this.feedbackData.index, 1);
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false;
          }, 1.5 * 100);

          this.openDeleteDialog = false;
        }
      );
    }
  }

  public handleViewFeedback(row: any) {
    this.feedback = this.feedbacks?.find((feedback) => feedback.id === row.id);
    this.openDialog = true;
  }

  public sortOptions = [
    { label: "ID Ascending", key: "+id" },
    { label: "ID Descending", key: "-id" },
  ];

  created() {
    this.fetchFeedbacks();
  }

  public async fetchFeedbacks(): Promise<void> {
    this.listLoading = true;
    const getFeedbacks = await this.getFeedbacks.execute(this.listQuery);
    getFeedbacks.cata(
      (failure) => {
        console.log(failure);
        this.listLoading = false;
      },
      (feedbacks: any) => {
        this.feedbacks = feedbacks.data;
        this.totalFeedback = feedbacks.page.totalElements;
        this.listLoading = false;
      }
    );
  }

  public sortChange() {
    console.log("object");
  }

  public getSortClass(id: string) {
    console.log("object");
  }
}
</script>
