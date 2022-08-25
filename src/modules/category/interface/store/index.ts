import { Category } from "./../../domain/category";
// import { SubCategoryState } from './index';
import { lazyInject } from "@/_core/di/container";
import store from "@/_core/store";
import { ResultPage } from "@/_core/utils/CQRS";
import { Message, Result } from "element-ui";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { DeleteCategory } from "../../app/useCases/DeletedCategory";
import { GetCategories } from "../../app/useCases/GetCategory";
import { CategoryListItemDTO, ListQuery, SearchQuery } from "../../domain/categoryRepository";
import { UpdateCategory } from "../../app/useCases/UpdateCategory";
import { CreateCategory } from "../../app/useCases/CreateCategory";
import { PaginatedQueryResult } from "@/_core/utils/DDD";
import { SearchCategory } from "../../app/useCases/SearchCategory";

export interface CategoryState {
    Category: string;
    subCategory: CategoryListItemDTO[];
}

@Module({
    dynamic: true,
    store,
    name: "CategoryStore",
})
export class CategoryStore extends VuexModule implements CategoryStore {
    public categories: Category[]=[];
    public totalElements: number[] = [];
    public category: Category={
        id: "",
        categoryName: "",
        subCategory:[],
        state: ""
    }
    public page: ResultPage = {
        pageSize: 10,
        current: 1,
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: true,
    };

    @lazyInject("GetCategories")
    private getCategoriesUseCase!: GetCategories;
    @lazyInject("DeleteSubCategory")
    private deleteCategoryUseCase!: DeleteCategory;
    @lazyInject("UpdateCategory")
    private updateCategoryUseCase!: UpdateCategory;
    @lazyInject("CreateCategory")
    private createCategoryUseCase!: CreateCategory;
    @lazyInject("SearchCategory")
    private searchCategoryUseCase!: SearchCategory;

    @Mutation
    setCategories(categories: PaginatedQueryResult<Category[]>) {
        if (categories.data.length < 0) {
            Object.assign(this.categories, []);
        } else {
            for (let i = 0; i < categories.data.length; i++) {
                this.categories.push(categories.data[i]);
            }
            for (let i = 0; i < 1; i++) {
                this.totalElements.push(categories.page.totalElements);
            }
        }
    }

    @Mutation
    setCategory(category: Category) {
        Object.assign(this.category, {});
        Object.assign(this.category, category);
    }

    @Mutation
    setCategoryEmpty() {
        this.categories = [];
    }

    @Mutation
    setTotalElementEmpty() {
        this.totalElements = [];
    }

    @Mutation
    setDeactivateCategory(state: string, id: string, index: number) {
        this.categories[index].state = state;
    }

    @Mutation
    setDelete(payload: any) {
        console.log("payload dlete; ", payload);
        this.categories[payload.index].categoryName = payload.progress;
    }

    @Action({ rawError: true })
    async listCategories(listQuery: ListQuery ) {
        const result = await this.getCategoriesUseCase.execute(listQuery);
        result.cata(
            (failure) => {
                throw Error("Listing Category Failed");
            },
            (categories) => {
                this.context.commit("setCategories", categories);
            }
        );
    }
    @Action({ rawError: true })
    async emptyCategory() {
        this.context.commit("setCategoryEmpty");
    }
    @Action({ rawError: true })
    async emptyTotalElements() {
        this.context.commit("setTotalElementEmpty");
    }

    @Action({ rawError: true })
    async deleteSubCategory(id: string) {
        await this.deleteCategoryUseCase.execute(id);
        this.context.commit("setDelete");
    }
    @Action({ rawError: true })
    async createCategory(data: CategoryListItemDTO) {
        console.log("data ", data)
        await this.createCategoryUseCase.execute(data);
    }
    @Action({ rawError: true })
    async updateCategory(data: any) {
        console.log("updated data ", data)
        await this.updateCategoryUseCase.execute(data.id, data);
    }
    @Action({ rawError: true })
    async searchCategory(searchQuery: SearchQuery) {
        const result = await this.searchCategoryUseCase.execute(searchQuery);
        result.cata(
            (failure) => {
                throw Error("Listing Employee Failed");
            },
            (categories) => {
                this.context.commit("setcategories", categories);
            }
        );
    }
}
