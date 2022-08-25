import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Employee } from "../../domain/employee";
import EmployeeRepository, { EmployeeDTO } from "../../domain/employeeRepository";

export interface UpdateEmployee {
    execute(id: string, data: EmployeeDTO): Promise<Either<Failure, Employee>>;
}

@injectable()
export class UpdateEmployee implements UpdateEmployee {
    constructor(
        @inject("EmployeeRepository")
        private employeeRepository: EmployeeRepository
    ) {}

    async execute(id: string, data: EmployeeDTO): Promise<Either<Failure, Employee>> {
        return await this.employeeRepository.UpdateEmployee(id, data);
    }
}
