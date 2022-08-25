import { injectable } from "inversify";
import { Employee } from "../domain/employee";
import EmployeeRepository, {
    EmployeeDTO,
    SearchQuery,
 ListQuery
} from "../domain/employeeRepository";
import request from "@/_core/utils/request";
import { Failure, ServerFailure } from "@/_core/error/failures";
import { Either, Left, Right } from "monet";
import { EmployeeMapper } from "./EmployeeMapper";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";

@injectable()
export default class EmployeeRepositoryImpl implements EmployeeRepository {
    async ListEmployee(
        listQuery: ListQuery
    ): Promise<Either<Failure, PaginatedQueryResult<Employee[]>>> {
        try {
            const response: any = await request({
                url: "/list/employees",
                method: "GET",
                params: listQuery,
            });

            return Right({
                data: EmployeeMapper.toEntities(response.data),
                page: {
                    totalPages: response.page.totalPages,
                    pageSize: response.page.pageSize,
                    totalElements: response.page.totalElements,
                    current: response.page.current,
                    first: response.page.page === 1,
                    last: response.page.page === response.page.totalPages,
                },
            });
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }
    async DeleteEmployee(id: string): Promise<Either<Failure, void>> {
        try {
            await request({
                url: `/employees/${id}`,
                method: "DELETE",
            });
            return Right(undefined);
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }

    async CreateEmployee(data: EmployeeDTO): Promise<Either<Failure, void>> {
        try {
            await request({
                url: "/employees",
                method: "POST",
                data,
            });
            return Right(undefined);
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }

    async UpdateEmployee(
        id: string,
        data: EmployeeDTO
    ): Promise<Either<Failure, Employee>> {
        try {
            const response = await request({
                url: `/update/employees/${id}`,
                method: "PATCH",
                data,
            });

            return Right(EmployeeMapper.toEntity(response.data));
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }

    async SearchEmployee(
        searchQuery: SearchQuery
    ): Promise<Either<Failure, PaginatedQueryResult<Employee[]>>> {
        try {
            const response: any = await request({
                url: "/search/employees",
                method: "GET",
                params: searchQuery,
            });

            return Right({
                data: EmployeeMapper.toEntities(response.data),
                page: {
                    totalPages: response.page.totalPages,
                    pageSize: response.page.pageSize,
                    totalElements: response.page.totalElements,
                    current: response.page.current,
                    first: response.page.page === 1,
                    last: response.page.page === response.page.totalPages,
                },
            });
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }

    async GetEmployee(id: string): Promise<Either<Failure, Employee>> {
        try {
            const response: any = await request({
                url: `employees/${id}`,
                method: "GET"
            });
            const map = EmployeeMapper.toEntity(response);

            return Right(map);
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }

    async EmployeeActivation(id: string, state: string): Promise<Either<Failure, void>> {
        try {
            request.patch(`/employees/deactivate/${id}`, { state: state });

            return Right(undefined);
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }
}
