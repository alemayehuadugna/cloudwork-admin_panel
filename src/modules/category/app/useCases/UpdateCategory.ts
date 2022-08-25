import { Category } from './../../domain/category';

import { Failure } from "@/_core/error/failures";
import { injectable, inject } from "inversify";
import { Either } from "monet";
import CategoryRepository, { CategoryListItemDTO } from "../../domain/categoryRepository";

export interface UpdateCategory {
    execute(id: string, data: CategoryListItemDTO): Promise<Either<Failure, Category>>;
}

@injectable()
export class UpdateCategoryImpl implements UpdateCategory {
    constructor(
        @inject("CategoryRepository")
        private categoryRepository: CategoryRepository
    ) {}

    async execute(id: string, data: CategoryListItemDTO): Promise<Either<Failure, Category>> {
        return await this.categoryRepository.UpdateCategory(id, data );
    }
}
