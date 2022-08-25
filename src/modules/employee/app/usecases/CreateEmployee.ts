import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Employee } from "../../domain/employee";
import EmployeeRepository, { EmployeeDTO } from "../../domain/employeeRepository";

export interface CreateEmployee {
    execute(employee: EmployeeDTO): Promise<Either<Failure, void>>;
}

@injectable()
export class CreateEmployeeImpl implements CreateEmployee {
    constructor(
        @inject("EmployeeRepository")
        private employeeRepository: EmployeeRepository
    ) {}

    async execute(employee: EmployeeDTO): Promise<Either<Failure, void>> {
        return await this.employeeRepository.CreateEmployee(employee);
    }
}
