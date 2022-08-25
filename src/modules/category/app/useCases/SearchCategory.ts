import { Failure } from "@/_core/error/failures";
import CategoryRepository, { SearchQuery } from "../../domain/categoryRepository";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Category } from "../../domain/category";

import { PaginatedQueryResult } from "@/_core/utils/CQRS";

export interface SearchCategory {
    execute(searchQuery: SearchQuery): Promise<Either<Failure, PaginatedQueryResult<Category[]>>>
}

@injectable()
export class SearchCategoryImpl implements SearchCategoryImpl {
    constructor(
        @inject("CategoryRepository")
        private categoryRepository: CategoryRepository
    ) {}

    async execute(searchQuery: SearchQuery): Promise<Either<Failure, PaginatedQueryResult<Category[]>>> {
        return await this.categoryRepository.SearchCategory(searchQuery);
    }
}
