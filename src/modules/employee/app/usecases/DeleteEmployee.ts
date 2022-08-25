import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import EmployeeRepository from "../../domain/employeeRepository";

export interface DeleteEmployee {
    execute(id: string): Promise<Either<Failure, void>>;
}

@injectable()
export class DeleteEmployeeImpl implements DeleteEmployee {
    constructor(
        @inject("EmployeeRepository")
        private employeeRepository: EmployeeRepository
    ) {}

    async execute(id: string): Promise<Either<Failure, void>> {
        return await this.employeeRepository.DeleteEmployee(id);
    }
}
