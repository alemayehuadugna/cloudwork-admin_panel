import { Container } from "inversify";
import { ListEmployee, ListEmployeeImpl } from "./app/usecases/ListEmployee";
import { DeleteEmployee, DeleteEmployeeImpl } from "./app/usecases/DeleteEmployee";
import { CreateEmployee, CreateEmployeeImpl } from "./app/usecases/CreateEmployee";
import { SearchEmployee, SearchEmployeeImpl } from "./app/usecases/SearchEmployee";
import { GetEmployee, GetEmployeeImpl } from "./app/usecases/GetEmployee";
import { DeactivateEmployee, DeactivateEmployeeImpl } from "./app/usecases/DeactivateEmployee";
import EmployeeRepository from "./domain/employeeRepository";
import EmployeeRepositoryImpl from "./infra/EmployeeRepositoryImpl";
import { UpdateBasicProfile } from "../user/app/usecases/UpdateBasicProfile";
import UserRepositoryImpl from "../user/infra/UserRepositoryImpl";

export function injectEmployee(container: Container) {
    container
        .bind<EmployeeRepository>("EmployeeRepository")
        .to(EmployeeRepositoryImpl)
        .inSingletonScope();
    container
        .bind<ListEmployee>("ListEmployee")
        .to(ListEmployeeImpl)
        .inSingletonScope();

    container
        .bind<DeleteEmployee>("DeleteEmployee")
        .to(DeleteEmployeeImpl)
        .inSingletonScope();

    container
        .bind<CreateEmployee>("CreateEmployee")
        .to(CreateEmployeeImpl)
        .inSingletonScope();

    container
        .bind<SearchEmployee>("SearchEmployee")
        .to(SearchEmployeeImpl)
        .inSingletonScope();

    container
        .bind<GetEmployee>("GetEmployee")
        .to(GetEmployeeImpl)
        .inSingletonScope();

    container
        .bind<DeactivateEmployee>("DeactivateEmployee")
        .to(DeactivateEmployeeImpl)
        .inSingletonScope();

      
}
