import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import CategoryRepository from "../../domain/categoryRepository";

export interface DeleteCategory{
    execute(id: string): Promise<Either<Failure, void>>
}

@injectable()
export class DeleteCategoryImpl implements DeleteCategory {
    constructor(
        @inject("CategoryRepository")
        private categoryRepository: CategoryRepository
    ) {}

    async execute(id: string): Promise<Either<Failure, void>> {
        console.log("the id:: ", id);
        return await this.categoryRepository.DeleteCategory(id);
    }
}
