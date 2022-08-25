<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button
                type="success"
                class="filter-item"
                icon="el-icon-plus"
                @click="handleCreate"
            >
                Create
            </el-button>
        </div>

        <el-table
            :key="tableKey"
            v-loading="listLoading"
            :data="categories"
            border
            fit
            highlight-current-row
            style="width: 100%"
        >
            <el-table-column
                label="ID No"
                prop="id"
                align="center"
                width="220px"
                sortable="custom"
            >
                <template slot-scope="{ row }">
                    <span>{{ formatId(row.id) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="Category Name" min-width="150px">
                <template slot-scope="{ row }">
                    <span>{{ row.categoryName }}</span>
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
                        @click="handleViewCategory(row)"
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
        <!-- when edit/view is torched -->
        <el-dialog :title="textMap.edit" :visible.sync="openDialog" width="30%">
            <el-form ref="dataForm" :model="category" class="create-form">
                <el-form-item label="Category Name" prop="categoryName">
                    <el-input v-model="category.categoryName" />
                </el-form-item>

                <el-form-item label="Sub Category" prop="subCategory">
                </el-form-item>

                <el-input
                    class="subInput"
                    disabled
                    placeholder="Sub category"
                    v-for="(subCat, index) in category.subCategory"
                    :value="subCat"
                    :key="index"
                >
                    <el-button
                        slot="append"
                        icon="el-icon-delete"
                        type="primary"
                        @click="removeTask(index, 'oldSub')"
                    ></el-button>
                </el-input>

                <el-input
                    class="subInput"
                    placeholder="Sub category"
                    v-for="(task, index) in length"
                    v-model="NewModelCategories[index]"
                    :key="task.id"
                >
                    <el-button
                        slot="append"
                        icon="el-icon-delete"
                        type="primary"
                        @click="removeTask(index, 'newSub')"
                    ></el-button>
                </el-input>

                <div>
                    <el-row type="flex" justify="end">
                        <el-button
                            @click="addTask"
                            type="success"
                            icon="el-icon-plus"
                            circle
                        ></el-button>
                    </el-row>
                </div>
            </el-form>

            <div>
                <el-button
                    @click="UpdateData"
                    type="primary"
                    style="color: white; border: none"
                >
                    Confirm
                </el-button>
                <el-button @click="openDialog = false"> Cancel </el-button>
            </div>
        </el-dialog>

        <el-dialog
            title="Warning"
            :visible.sync="openDeleteDialog"
            width="25%"
            top="15%"
        >
            <span>Are You Sure to Delete?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="openDeleteDialog = false">Cancel</el-button>
                <el-button
                    type="primary"
                    style="background: red; color: white; border: none"
                    @click="handleDeleteCategory"
                    >Confirm</el-button
                >
            </span>
        </el-dialog>
        <!-- when create is touched -->
        <el-dialog
            :title="textMap.create"
            :visible.sync="openCreateDialog"
            width="30%"
        >
            <el-form-item label="Create Category"></el-form-item>
            <el-form ref="dataForm" :model="category" class="create-form">
                <el-form-item label="Category Name" prop="categoryName">
                    <el-input v-model="categoryNewName" />
                </el-form-item>

                <el-form-item label="Sub Category" prop="subCategory">
                </el-form-item>
                <el-input
                    class="subInput"
                    placeholder="Sub category"
                    v-for="(task, index) in length"
                    v-model="modelCategories[index]"
                    :key="task.id"
                >
                    <el-button
                        slot="append"
                        icon="el-icon-delete"
                        type="primary"
                        @click="removeTask(index, 'newSub')"
                    ></el-button>
                </el-input>

                <div>
                    <el-row type="flex" justify="end">
                        <el-button
                            @click="addTask"
                            type="success"
                            icon="el-icon-plus"
                            circle
                        ></el-button>
                    </el-row>
                </div>
            </el-form>

            <div>
                <el-button
                    @click="createData"
                    type="primary"
                    style="color: white; border: none"
                >
                    Confirm
                </el-button>
                <el-button @click="openCreateDialog = false"> Cancel </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Pagination from "@/_sharedKernel/components/Pagination/index.vue";
import { GetCategories } from "../../app/useCases/GetCategory";
import { DeleteCategory } from "../../app/useCases/DeletedCategory";
import { lazyInject } from "@/_core/di/container";
import {
    CategoryListItemDTO,
    ListQuery,
} from "../../domain/categoryRepository";
import { Category } from "../../domain/category";
import { getModule } from "vuex-module-decorators";
import { CategoryStore } from "../../interface/store/index";
import { Form } from "element-ui";
import { cloneDeep } from "lodash";
import { SearchQuery } from "@/modules/employee/domain/employeeRepository";

type FilterOptions = {
    experience: undefined;
    startDateBetween?: string[];
    progress?: string;
};

@Component({
    name: "categories",
    components: {
        Pagination,
    },
})
export default class extends Vue {
    @lazyInject("GetCategories") private getCategories!: GetCategories;
    @lazyInject("DeleteCategory") private deleteCategory!: DeleteCategory;
    @lazyInject("UpdateCategory") private updateCategory!: DeleteCategory;

    private list?: CategoryListItemDTO[] = [];
    public modelCategories = [];
    public NewModelCategories = [];
    public UpdatedCategories = [];

    public categories?: Category[] = [];

    private categoryData = { id: "", index: 0 };
    private totalCategory?: number;
    private subCategory = [];
    private total?: number[] = [];
    public tableKey = 0;
    public listLoading = false;
    public search = "";
    private openDialog = false;
    private openDeleteDialog = false;
    private openCreateDialog = false;
    private newTask = [""];
    private tasks = [];
    private length = 1;
    private title = "";
    private payload: any = {};
    private dialogStatus = "";
    private dialogFormVisible = false;
    private textMap = {
        update: "Edit",
        create: "Create",
    };
    categoryNewName: string = "";
    id: string = "";

    private temp: CategoryListItemDTO = {
        categoryName: "",
        subCategory: [""],
        // id: "",
        state: "",
    };
    public listQuery: ListQuery = {
        page: 1,
        limit: 10,
        sort: undefined,
        filter: {
            categoryName: undefined,
            state: undefined,
        },
    };
    private searchQuery: SearchQuery = {
        page: this.listQuery.page,
        limit: this.listQuery.limit,
        filter: {
            searchItem: undefined,
        },
    };
    private async getList() {
        console.log("call from pagination page number is", this.listQuery.page);
        this.listLoading = true;
        // if (this.categoryStore.categories.length <= 0) {
        console.log("no data in store", this.categoryStore.categories.length);
        this.categoryStore.emptyCategory();
        this.categoryStore.emptyTotalElements();
        if (this.searchQuery.filter.searchItem) {
            await this.categoryStore.searchCategory(this.searchQuery);
        } else {
            await this.categoryStore.listCategories(this.listQuery);
        }
        const data = this.categoryStore.categories;
        const page = this.categoryStore.totalElements;
        this.list = data;
        this.total = page;
        // } else {
        //   console.log("there is data in store", this.categoryStore.categories.length);
        //   const data = this.categoryStore.categories;
        //   const page = this.categoryStore.totalElements;
        //   this.list = data;
        //   this.total = page;
        // }

        // Just to simulate the time of the request
        setTimeout(() => {
            this.listLoading = false;
        }, 0.5 * 1000);
    }

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

    private tempCategoryData: CategoryListItemDTO = this.temp;

    get categoryStore(): CategoryStore {
        return getModule(CategoryStore, this.$store);
    }

    categoryChanged(newVal: string) {
        if (newVal.length === 0) {
            this.listQuery.filter.categoryName = undefined;

            this.fetchCategories();
        }
    }
    addTask(index: number) {
        console.log("here");

        this.length++;
        console.log(this.modelCategories);
    }
    removeTask(index: number, type: String) {
        if (type === "newSub") {
            console.log("new subcategory is deleting");
            this.modelCategories.splice(index, 1);
            this.length--;
        } else if (type === "oldSub") {
            console.log(this.category.subCategory.splice(index, 1));
        }
    }
    getFilteredData() {
        console.log("object");
    }
    private category: any = {};

    createCategory() {}

    async saveCategory() {
        let newSubcategory = [
            ...this.category.subCategory,
            ...this.modelCategories,
        ];

        this.categoryStore.updateCategory;
        this.list = this.categoryStore.categories;

        console.log(newSubcategory);

        console.log(this.category);

        console.log();
    }

    // public get value(): string {
    //     // return;
    // }

    public formatId(id: string) {
        return id.slice(0, 5);
    }

    private confirm(id: string, index: number) {
        this.openDeleteDialog = true;
        if (this.openDeleteDialog) {
            this.categoryData.id = id;
            this.categoryData.index = index;
        }
    }
    private handleCreate() {
        this.resetTempArticleData();
        this.dialogStatus = "create";
        this.openCreateDialog = true;
        this.$nextTick(() => {
            (this.$refs.dataForm as Form).clearValidate();
        });
    }

    private createData() {
        (this.$refs.dataForm as Form).validate(async (valid) => {
            if (valid) {
                const categoryName = this.categoryNewName;
                const subCategory = this.modelCategories;
                // const id = this.tempCategoryData.id;
                const state = this.tempCategoryData.state;
                console.log("categoryname: ", subCategory);

                this.categoryStore.createCategory({
                    categoryName,
                    subCategory,
                    // id,
                    state,
                });
                this.openCreateDialog = false;
                this.getList();
                this.$notify({
                    title: "Success",
                    message: "Created Successfully",
                    type: "success",
                    duration: 2000,
                });
                this.categoryNewName = "";
                this.modelCategories = [];
                window.location.reload();
            }
        });
    }
    private UpdateData() {
        this.UpdatedCategories=this.category.subCategory.concat(this.NewModelCategories);
        var categoryName: string = this.category.categoryName;
        var subCategory: string[]= this.UpdatedCategories;
        var state: string = "";
        var id = this.id;
       
        this.categoryStore.updateCategory({
            id,
            categoryName,
            subCategory,
            state,
        });
        window.location.reload();
        this.openDialog = false;
                this.getList();
                this.$notify({
                    title: "Success",
                    message: "Updated Successfully",
                    type: "success",
                    duration: 2000,
                    
                });
                
                // this.categoryNewName = "";
                // this.modelCategories = [];
    }

    private async handleGet(row: any, index: number) {
        const category = this.categoryStore.category;
        if (category.categoryName !== "") {
            this.dialogStatus = "cet";
            this.openCreateDialog = true;

            this.tempCategoryData.categoryName = category.categoryName;
            this.tempCategoryData.subCategory =
                this.categoryStore.category.subCategory;
        } else {
            await this.categoryStore.listCategories(row.uid);
            this.dialogStatus = "Get";
            this.openCreateDialog = true;

            this.tempCategoryData.categoryName =
                this.categoryStore.category.categoryName;
            this.tempCategoryData.subCategory =
                this.categoryStore.category.subCategory;
        }
    }

    private resetTemep() {
        this.temp = {
            categoryName: "",
            subCategory: [],
            // id: "",
            state: "",
        };
    }

    private resetTempArticleData() {
        this.tempCategoryData = cloneDeep(this.temp);
    }
    public async handleDeleteCategory() {
        if (this.categoryData.id) {
            const deleteCategory = await this.deleteCategory.execute(
                this.categoryData.id
            );
            deleteCategory.cata(
                (failure) => {
                    console.log(failure);
                },
                (categories: any) => {
                    this.$notify({
                        title: "Success",
                        message: "Delete Successfully",
                        type: "success",
                        duration: 2000,
                    });

                    this.categories?.splice(this.categoryData.index, 1);
                    // Just to simulate the time of the request
                    setTimeout(() => {
                        this.listLoading = false;
                    }, 1.5 * 100);

                    this.openDeleteDialog = false;
                }
            );
        }
    }

    public handleViewCategory(row: any) {
        this.id = row.id;
        this.category = this.categories?.find(
            (category) => category.id === row.id
        );
        this.openDialog = true;
        console.log(this.category);
    }
    public create(id: string, index: number) {
        this.openCreateDialog = true;
        if (this.openCreateDialog) {
            this.categoryData.id = id;
            this.categoryData.index = index;
        }
    }
    public sortOptions = [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
    ];

    created() {
        this.fetchCategories();
    }
    public async fetchCategories(): Promise<void> {
        this.listLoading = true;
        const getCategories = await this.getCategories.execute(this.listQuery);
        getCategories.cata(
            (failure) => {
                console.log(failure);
                console.log("here");
                this.listLoading = false;
            },
            (categories: any) => {
                this.categories = categories.data;
                console.log("this.categories", this.categories);
                this.totalCategory = categories.page.totalElements;
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

<style scoped>
.demo-input-label {
    display: inline-block;
    width: 130px;
}
.subInput {
    margin-bottom: 10px;
}
</style>
