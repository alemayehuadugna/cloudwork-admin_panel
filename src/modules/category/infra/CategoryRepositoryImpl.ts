import { Failure, ServerFailure } from "@/_core/error/failures";
import request from "@/_core/utils/request";
import { Left, Right, Either } from "monet";
import CategoryRepository, { CategoryListItemDTO, ListQuery, SearchQuery } from "../domain/categoryRepository";
import { CategoryMapper } from "./CategoryMapper";
import { Category } from "../domain/category";
import { injectable } from "inversify";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";

@injectable()
export default class CategoryRepositoryImpl implements CategoryRepository {
    SearchCategory(search: SearchQuery): Promise<Either<Failure, PaginatedQueryResult<Category[]>>> {
        throw new Error("Method not implemented.");
    }
    async DeleteCategory(id: string): Promise<Either<Failure, void>> {
        try {
            await request({
                url: `/categories/${id}`,
                method: "DELETE"
            });
            return Right(undefined);
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }
    async GetCategories(listQuery: ListQuery): Promise<
        Either<Failure, PaginatedQueryResult<Category[]>>
    > {
        try {
            // const url = urlGenerator(props);

            const response: any = await request({
                url: "/categories",
                method: "GET",
                params: listQuery
            });
            // 
            // console.log("free", response);

            return Right({
                data: CategoryMapper.toEntities(response.data),
                page: response.page,
            });
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }
    async UpdateCategory(
        id: string,
        data: CategoryListItemDTO
    ): Promise<Either<Failure, Category>> {
        console.log("repo data", data);
        try {
        const response: any= await request({
            url:`/categories/${id}`,
            method: "PATCH",
            data,
        });
        return Right(CategoryMapper.toEntity(response.data));
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
        
    }

    async CreateCategory(data: CategoryListItemDTO): Promise<Either<Failure, void>> {
        try {
            await request({
                url: "/categories",
                method: "POST",
                data,
            });
            return Right(undefined);
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }
    
}
