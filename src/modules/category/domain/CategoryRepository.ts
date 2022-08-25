import { Category } from "./category";
import { Either } from "monet";
import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";


type CategoryListItemDTO = {
	// id: string;
    categoryName: string;
	subCategory?: string[];
    state: string;
};

type FilterQuery = {

	categoryName: string | undefined
	// subCategory?: string[];
	state: string | undefined
}

type ListQuery = {
	page: number,
	limit: number,
	sort: string | undefined,
	filter: FilterQuery
}
type SearchFor = {
    searchItem: string | undefined
}
type SearchQuery = {
    page: number,
    limit: number,
    filter: SearchFor
}

interface CategoryRepository {
	GetCategories(listQuery: ListQuery): Promise<Either<Failure, PaginatedQueryResult<Category[]>>>;
	DeleteCategory(id: string): Promise<Either<Failure, void>>;
	CreateCategory(category:CategoryListItemDTO):Promise<Either<Failure, void>>;
	UpdateCategory(id: string,data:CategoryListItemDTO): Promise<Either<Failure, Category>>;
	SearchCategory(search: SearchQuery) : Promise<Either<Failure, PaginatedQueryResult<Category[]>>>;
}

export default CategoryRepository;

export type { CategoryListItemDTO, ListQuery, SearchQuery };
