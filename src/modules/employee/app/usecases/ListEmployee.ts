import { Failure } from "@/_core/error/failures";
import EmployeeRepository, { ListQuery } from "../../domain/employeeRepository";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Employee } from "../../domain/employee";

import { PaginatedQueryResult } from "@/_core/utils/CQRS";

export interface ListEmployee {
    execute(listQuery: ListQuery): Promise<Either<Failure, PaginatedQueryResult<Employee[]>>>;
}

@injectable()
export class ListEmployeeImpl implements ListEmployee {
    constructor(
        @inject("EmployeeRepository")
        private employeeRepository: EmployeeRepository
    ) {}

    async execute(listQuery: ListQuery): Promise<Either<Failure, PaginatedQueryResult<Employee[]>>> {
        return await this.employeeRepository.ListEmployee(listQuery);
    }
}
