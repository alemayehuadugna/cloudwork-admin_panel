import { User } from "./user";
import { Either } from "monet";
import { Failure } from "@/_core/error/failures";
import { EmployeeDTO } from "@/modules/employee/domain/employeeRepository";
import { Employee } from "@/modules/employee/domain/employee";

type UserDTO = {
    firstName: string;
    lastName: string;
    // phone: string;
    email: string;
    
    
};
type UserDTO2 = {
    oldPassword:string;
    newPassword: string;
    confPassword: string;

};
interface UserRepository {
    GetUserInfo(): Promise<Either<Failure, User>>;
    Logout(): Promise<Either<Failure, void>>;
    Login(payload: {
        email: string;
        password: string;
    }): Promise<Either<Failure, string>>;
    UpdateBasicProfile(id: string, data: UserDTO): Promise<Either<Failure, User>>;
    UpdatePassword(id: string, data: UserDTO2): Promise<Either<Failure, void>>;
}

export default UserRepository;
export type { UserDTO };
export type { UserDTO2 };
