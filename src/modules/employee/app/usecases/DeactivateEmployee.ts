import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import EmployeeRepository from "../../domain/employeeRepository";

export interface DeactivateEmployee {
    execute(id: string, state: string): Promise<Either<Failure, void>>;
}

@injectable()
export class DeactivateEmployeeImpl implements DeactivateEmployee {
    constructor(
        @inject("EmployeeRepository")
        private employeeRepository: EmployeeRepository
    ) {}

    async execute(id: string, state: string): Promise<Either<Failure, void>> {
        return await this.employeeRepository.EmployeeActivation(id, state);
    }
}
