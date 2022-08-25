import { Container } from "inversify";
import { CreateCategory, CreateCategoryImpl } from "./app/useCases/CreateCategory";
import { DeleteCategory, DeleteCategoryImpl } from "./app/useCases/DeletedCategory";
import { GetCategories, GetCategoriesImpl } from "./app/useCases/GetCategory";
import { SearchCategory, SearchCategoryImpl } from "./app/useCases/SearchCategory";
import { UpdateCategory, UpdateCategoryImpl } from "./app/useCases/UpdateCategory";
import CategoryRepository from "./domain/categoryRepository";
import CategoryRepositoryImpl from "./infra/CategoryRepositoryImpl";


export function injectCategory(container: Container) {
    container.bind<CategoryRepository>("CategoryRepository").to(CategoryRepositoryImpl).inSingletonScope();
    container.bind<GetCategories>("GetCategories").to(GetCategoriesImpl).inSingletonScope();
    container.bind<DeleteCategory>("DeleteCategory").to(DeleteCategoryImpl).inSingletonScope();
    container.bind<CreateCategory>("CreateCategory").to(CreateCategoryImpl).inSingletonScope();
    container.bind<UpdateCategory>("UpdateCategory").to(UpdateCategoryImpl).inSingletonScope();
    container.bind<SearchCategory>("SearchCategory").to(SearchCategoryImpl).inSingletonScope();

    
}
