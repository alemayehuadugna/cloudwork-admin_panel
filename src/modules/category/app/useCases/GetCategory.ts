import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/DDD";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Category } from "../../domain/category";
import CategoryRepository, { ListQuery } from "../../domain/categoryRepository";

export interface GetCategories {
	execute(listQuery: ListQuery): Promise<Either<Failure, PaginatedQueryResult<Category[]>>>;
}

@injectable()
export class GetCategoriesImpl implements GetCategories {
	constructor(@inject("CategoryRepository") private categoryRepository: CategoryRepository) { }

	async execute(listQuery: ListQuery): Promise<Either<Failure, PaginatedQueryResult<Category[]>>> {
		return await this.categoryRepository.GetCategories(listQuery);
	}
}
