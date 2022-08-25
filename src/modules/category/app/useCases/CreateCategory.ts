import { Failure } from "@/_core/error/failures";
import { injectable, inject } from "inversify";
import { Either } from "monet";
import CategoryRepository, { CategoryListItemDTO } from "../../domain/categoryRepository";

export interface CreateCategory {
    execute(category: CategoryListItemDTO): Promise<Either<Failure, void>>;
}

@injectable()
export class CreateCategoryImpl implements CreateCategory {
    constructor(
        @inject("CategoryRepository")
        private categoryRepository: CategoryRepository
    ) {}

    async execute(category: CategoryListItemDTO): Promise<Either<Failure, void>> {
        return await this.categoryRepository.CreateCategory(category);
    }
}
