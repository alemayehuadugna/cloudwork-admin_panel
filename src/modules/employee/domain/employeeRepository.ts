import { Employee } from "./employee";
import { Either } from "monet";
import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";

type EmployeeDTO = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gender: string;
};

type FilterQuery = {
    gender: String | undefined
}

type ListQuery = {
    page: number,
    limit: number,
    sort: string | null
    filter: FilterQuery
}

type SearchFor = {
    searchItem: string | undefined
}
type SearchQuery = {
    page: number,
    limit: number,
    filter: SearchFor
}

interface EmployeeRepository {
    ListEmployee(listQuery: ListQuery): Promise<Either<Failure, PaginatedQueryResult<Employee[]>>>;
    DeleteEmployee(id: string): Promise<Either<Failure, void>>;
    CreateEmployee(employee: EmployeeDTO): Promise<Either<Failure, void>>;
    UpdateEmployee(id: string, data: EmployeeDTO): Promise<Either<Failure, Employee>>;
    SearchEmployee(search: SearchQuery) : Promise<Either<Failure, PaginatedQueryResult<Employee[]>>>;
    GetEmployee(id: string): Promise<Either<Failure, Employee>>;
    EmployeeActivation(id: string, state: string): Promise<Either<Failure, void>>;
}

export default EmployeeRepository;
export type { EmployeeDTO, ListQuery, SearchQuery };
