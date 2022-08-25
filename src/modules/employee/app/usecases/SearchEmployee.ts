import { Failure } from "@/_core/error/failures";
import EmployeeRepository, { SearchQuery } from "../../domain/employeeRepository";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Employee } from "../../domain/employee";

import { PaginatedQueryResult } from "@/_core/utils/CQRS";

export interface SearchEmployee {
    execute(searchQuery: SearchQuery): Promise<Either<Failure, PaginatedQueryResult<Employee[]>>>
}

@injectable()
export class SearchEmployeeImpl implements SearchEmployeeImpl {
    constructor(
        @inject("EmployeeRepository")
        private employeeRepository: EmployeeRepository
    ) {}

    async execute(searchQuery: SearchQuery): Promise<Either<Failure, PaginatedQueryResult<Employee[]>>> {
        return await this.employeeRepository.SearchEmployee(searchQuery);
    }
}
