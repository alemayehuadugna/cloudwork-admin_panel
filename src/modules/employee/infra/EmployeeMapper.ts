import { Employee } from "../domain/employee";

const EmployeeMapper = {
    toEntity(json: any):Employee {
        const employee = {
            uid: json.id.value,
            firstName: json.firstName,
            lastName: json.lastName,
            phone: json.phone,
            email: json.email,
            gender: json.gender,
            roles: json.roles,
            state: json.state
        };
        return employee;
    },
    toEntities: function (json: any[]) {
        return json.map(entity => {
            return this.toEntity(entity);
        });
    },
    toJson(entity: Employee): JSON {
        return JSON.parse(JSON.stringify(entity));
    },
};

export { EmployeeMapper };
