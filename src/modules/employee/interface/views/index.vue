<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchQuery.filter.searchItem"
        placeholder="Search For"
        style="width: 300px"
        class="filter-item"
        @keyup.enter.native="
          listQuery.searchFor === undefined ||
          listQuery.searchFor === '' ||
          listQuery.searchBy === undefined ||
          listQuery.searchBy === ''
            ? getList()
            : handleFilter()
        "
      />
      <el-select
        v-model="listQuery.filter.gender"
        placeholder="Filter By"
        clearable
        style="width: 112px; margin-left: 3px"
        class="filter-item"
      >
        <el-option
          v-for="item in filterByOptions"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
      <el-button
        class="filter-item"
        style="margin-left: 5px"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        Search
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 20px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        Add
      </el-button>
      <el-button
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
      >
        Export
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" align="center" width="220px">
        <template slot-scope="{ row }">
          <span>{{ row.uid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Name" min-width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.firstName + " " + row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Phone" min-width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Email" min-width="200px">
        <template slot-scope="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="Actions"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button size="mini" @click="handleGet(row, $index)" type="info">
            View
          </el-button>

          <el-button
            v-if="row.state === 'DEACTIVATED'"
            size="mini"
            type="success"
            @click="handleModifyStatus(row, 'ACTIVE', $index)"
          >
            Activate
          </el-button>

          <el-button
            v-if="row.state === 'ACTIVE'"
            size="mini"
            @click="handleModifyStatus(row, 'DEACTIVATED', $index)"
          >
            Deactivate
          </el-button>

          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-show="total[0] > 0"
      :total="total[0]"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap.create" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="tempEmployeeData" class="create-form">
        <el-form-item label="First Name" prop="firstName">
          <el-input v-model="tempEmployeeData.firstName" />
        </el-form-item>
        <el-form-item label="Last Name" prop="lastName">
          <el-input v-model="tempEmployeeData.lastName" />
        </el-form-item>
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="tempEmployeeData.phone" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="tempEmployeeData.email" />
        </el-form-item>

        <el-form-item label="Gender">
          <el-select
            v-model="tempEmployeeData.gender"
            class="filter-item"
            placeholder="Please select"
          >
            <el-option
              v-for="item in genderOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> Cancel </el-button>
        <el-button type="primary" @click="createData"> Confirm </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Form } from "element-ui";
import { cloneDeep } from "lodash";
// import { getArticles, getPageviews, createArticle, updateArticle, defaultArticleData } from '@/api/articles'
import Pagination from "@/_sharedKernel/components/Pagination/index.vue";
import { Employee } from "../../domain/employee";
import { ListEmployee } from "../../app/usecases/ListEmployee";
import { lazyInject } from "@/_core/di/container";
import { EmployeeStore } from "@/modules/employee/interface/store/index";
import { getModule } from "vuex-module-decorators";
import {
  EmployeeDTO,
  ListQuery,
  SearchQuery,
} from "../../domain/employeeRepository";

@Component({
  name: "EmployeeTable",
  components: {
    Pagination,
  },
})
export default class extends Vue {
  @lazyInject("ListEmployee") private listEmployee!: ListEmployee;

  private tableKey = 0;
  private list?: Employee[] = [];
  private total?: number[] = [];
  private listLoading = true;
  private listQuery: ListQuery = {
    page: 1,
    limit: 10,
    sort: "-firstName",
    filter: {
      gender: undefined,
    },
  };

  private searchQuery: SearchQuery = {
    page: this.listQuery.page,
    limit: this.listQuery.limit,
    filter: {
      searchItem: undefined,
    },
  };

  private sortOptions = [
    { label: "ID Ascending", key: "+id" },
    { label: "ID Descending", key: "-id" },
  ];
  private temp: EmployeeDTO = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
  };
  private genderOptions = ["Male", "Female"];
  private showReviewer = false;
  private dialogFormVisible = false;
  private filterByOptions = ["Male", "Female"];
  private dialogStatus = "";
  private textMap = {
    update: "Edit",
    create: "Create",
  };

  private dialogPageviewsVisible = false;
  private pageviewsData = [];
  private rules = {
    type: [{ required: true, message: "type is required", trigger: "change" }],
    timestamp: [
      { required: true, message: "timestamp is required", trigger: "change" },
    ],
    title: [{ required: true, message: "title is required", trigger: "blur" }],
  };

  private downloadLoading = false;
  private tempEmployeeData: EmployeeDTO = this.temp;

  created() {
    this.getList();
  }

  get employeeStore(): EmployeeStore {
    return getModule(EmployeeStore, this.$store);
  }

  private async getList() {
    console.log("call from pagination page number is", this.listQuery.page);
    this.listLoading = true;
    // if (this.employeeStore.employees.length <= 0) {
    console.log("no data in store", this.employeeStore.employees.length);
    this.employeeStore.emptyEmployee();
    this.employeeStore.emptyTotalElements();
    if (this.searchQuery.filter.searchItem) {
      await this.employeeStore.searchEmployee(this.searchQuery);
    } else {
      await this.employeeStore.listEmployee(this.listQuery);
    }
    const data = this.employeeStore.employees;
    const page = this.employeeStore.totalElements;
    this.list = data;
    this.total = page;
    // } else {
    //   console.log("there is data in store", this.employeeStore.employees.length);
    //   const data = this.employeeStore.employees;
    //   const page = this.employeeStore.totalElements;
    //   this.list = data;
    //   this.total = page;
    // }

    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false;
    }, 0.5 * 1000);
  }

  private handleFilter() {
    this.listQuery.page = 1;
    this.getList();
  }

  private async handleModifyStatus(row: any, state: string, index: number) {
    row.state = state;
    // console.log("modify data: ", holdState);
    const payload = {
      id: row.uid,
      state: row.state,
      index: index
    };

    await this.employeeStore.employeeActivation(payload);
  }

  // private sortChange(data: any) {
  //   const { prop, order } = data
  //   if (prop === 'id') {
  //     this.sortByID(order)
  //   }
  // }

  //  private sortByID(order: string) {
  //   if (order === 'ascending') {
  //     this.listQuery.sort = '+id'
  //   } else {
  //     this.listQuery.sort = '-id'
  //   }
  //   this.handleFilter()
  // }

  // private getSortClass(key: string) {
  //  const sort = this.listQuery.sort
  //  return sort === `+${key}` ? 'ascending' : 'descending'
  // }

  private resetTempArticleData() {
    this.tempEmployeeData = cloneDeep(this.temp);
  }

  private handleCreate() {
    this.resetTempArticleData();
    this.dialogStatus = "create";
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }

  private createData() {
    (this.$refs.dataForm as Form).validate(async (valid) => {
      if (valid) {
        const firstName = this.tempEmployeeData.firstName;
        const lastName = this.tempEmployeeData.lastName;
        const phone = this.tempEmployeeData.phone;
        const email = this.tempEmployeeData.email;
        const gender = this.tempEmployeeData.gender;

        this.employeeStore.createEmployee({
          firstName,
          lastName,
          phone,
          email,
          gender,
        });
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
          title: "Success",
          message: "Created Successfully",
          type: "success",
          duration: 2000,
        });
      }
    });
  }

  private async handleGet(row: any, index: number) {
    const employee = this.employeeStore.employee;
    if (employee.firstName !== "") {
      this.dialogStatus = "cet";
      this.dialogFormVisible = true;

      this.tempEmployeeData.firstName = employee.firstName;
      this.tempEmployeeData.lastName = this.employeeStore.employee.lastName;
      this.tempEmployeeData.phone = this.employeeStore.employee.phone;
      this.tempEmployeeData.email = this.employeeStore.employee.email;
      this.tempEmployeeData.gender = this.employeeStore.employee.gender;
    } else {
      await this.employeeStore.getEmployee(row.uid);
      this.dialogStatus = "Get";
      this.dialogFormVisible = true;

      this.tempEmployeeData.firstName = this.employeeStore.employee.firstName;
      this.tempEmployeeData.lastName = this.employeeStore.employee.lastName;
      this.tempEmployeeData.phone = this.employeeStore.employee.phone;
      this.tempEmployeeData.email = this.employeeStore.employee.email;
      this.tempEmployeeData.gender = this.employeeStore.employee.gender;
    }
  }

  private resetTemep() {
    this.temp = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      gender: "",
    };
  }

  private async handleDelete(row: any, index: number) {
    await this.employeeStore.deleteEmployee(row.uid);
    const page = this.employeeStore.totalElements;
    this.total = page;
    this.$notify({
      title: "Success",
      message: "Deleted Successfully",
      type: "success",
      duration: 2000,
    });
    this.list?.splice(index, 1);
  }
}
</script>
