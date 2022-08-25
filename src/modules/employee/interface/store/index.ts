import {
    VuexModule,
    Module,
    Action,
    Mutation,
    getModule,
} from "vuex-module-decorators";
import store from "@/_core/store";
import { ListEmployee } from "../../app/usecases/ListEmployee";
import { DeleteEmployee } from "../../app/usecases/DeleteEmployee";
import { CreateEmployee } from "../../app/usecases/CreateEmployee";
import { SearchEmployee } from "../../app/usecases/SearchEmployee";
import { lazyInject } from "@/_core/di/container";
import { Employee } from "../../domain/employee";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { ListQuery, SearchQuery, EmployeeDTO } from "../../domain/employeeRepository";

import { UpdateEmployee } from "../../app/usecases/UpdateEmployee";
import { GetEmployee } from "../../app/usecases/GetEmployee";
import { Empty, Message } from "element-ui";
import { DeactivateEmployee } from "../../app/usecases/DeactivateEmployee";

export interface EmployeeState {
    employees: Employee[];
    totalElements: number[];
    employee: Employee;
}

@Module({
    dynamic: true,
    store,
    name: "employee",
})
export class EmployeeStore extends VuexModule implements EmployeeState {
    public employees: Employee[] = [];
    public totalElements: number[] = [];
    public employee: Employee = {
        uid: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        gender: "",
        roles: [],
        state: ""
    }
    @lazyInject("ListEmployee") private listEmployeeUseCase!: ListEmployee;
    @lazyInject("DeleteEmployee")
    private deleteEmployeeUseCase!: DeleteEmployee;
    @lazyInject("CreateEmployee")
    private createEmployeeUseCase!: CreateEmployee;
    @lazyInject("UpdateEmployee")
    private updateEmployeeUseCase!: UpdateEmployee;
    @lazyInject("SearchEmployee")
    private searchEmployeeUseCase!: SearchEmployee;
    @lazyInject("GetEmployee")
    private getEmployeeUseCase!: GetEmployee;
    @lazyInject("DeactivateEmployee")
    private employeeActivationUseCase!: DeactivateEmployee;

    @Mutation
    setEmployees(employees: PaginatedQueryResult<Employee[]>) {
        if (employees.data.length < 0) {
            Object.assign(this.employees, []);
        } else {
            for (let i = 0; i < employees.data.length; i++) {
                this.employees.push(employees.data[i]);
            }
            for (let i = 0; i < 1; i++) {
                this.totalElements.push(employees.page.totalElements);
            }
        }
    }

    @Mutation
    setEmployee(employee: Employee) {
        Object.assign(this.employee, {});
        Object.assign(this.employee, employee);
    }

    @Mutation
    setEmployeeEmpty() {
        this.employees = [];
    }

    @Mutation
    setTotalElementEmpty() {
        this.totalElements = [];
    }

    @Mutation
    setDeactivateEmployee(state: string, id: string, index: number) {
        this.employees[index].state = state;
    }

    @Action({ rawError: true })
    async listEmployee(listQuery: ListQuery) {
        const result = await this.listEmployeeUseCase.execute(listQuery);
        result.cata(
            (failure) => {
                throw Error("Listing Employee Failed");
            },
            (employees) => {
                this.context.commit("setEmployees", employees);
            }
        );
    }

    @Action({ rawError: true })
    async emptyEmployee() {
        this.context.commit("setEmployeeEmpty");
    }

    @Action({ rawError: true })
    async emptyTotalElements() {
        this.context.commit("setTotalElementEmpty");
    }

    @Action({ rawError: true })
    async deleteEmployee(id: string) {
        await this.deleteEmployeeUseCase.execute(id);
    }

    @Action({ rawError: true })
    async createEmployee(data: EmployeeDTO) {
        await this.createEmployeeUseCase.execute(data);
    }

    @Action({ rawError: true })
    async updateEmployee(data:any ) {
        
        await this.updateEmployeeUseCase.execute(data.id, data);
    }

    @Action({ rawError: true })
    async searchEmployee(searchQuery: SearchQuery) {
        const result = await this.searchEmployeeUseCase.execute(searchQuery);
        result.cata(
            (failure) => {
                throw Error("Listing Employee Failed");
            },
            (employees) => {
                this.context.commit("setEmployees", employees);
            }
        );
    }

    @Action({ rawError: true })
    async getEmployee(id: string) {
        const result = await this.getEmployeeUseCase.execute(id);
        result.cata(
            (failure) => {
                throw Error("Listing Employee Failed");
            },
            (employee) => {
                this.context.commit("setEmployee", employee);
            }
        );
    }

    @Action({ rawError: true })
    async employeeActivation(payload: any) {
        const result = await this.employeeActivationUseCase.execute(payload.id, payload.state);
        result.cata(
            (failure) => {
                Message({
                    message: "Changing Activation Failed",
                    type: "error",
                    duration: 5 * 1000,
                });
            },
            (success) => {
                Message({
                    message: "Changing Activation Successfully",
                    type: "success",
                    duration: 5 * 1000,
                });
                // this.context.commit("setDeactivateEmployee", {state, id, index});
            }
        );
    }
}
