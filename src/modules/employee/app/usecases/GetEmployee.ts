import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Employee } from "../../domain/employee";
import EmployeeRepository from "../../domain/employeeRepository";

export interface GetEmployee {
    execute(id: string): Promise<Either<Failure, Employee>>;
}

@injectable()
export class GetEmployeeImpl implements GetEmployee {
    constructor(
        @inject("EmployeeRepository")
        private employeeRepository: EmployeeRepository
    ) {}

    async execute(id: string): Promise<Either<Failure, Employee>> {
        return await this.employeeRepository.GetEmployee(id);
    }
}
