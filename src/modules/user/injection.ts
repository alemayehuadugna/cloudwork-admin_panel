import { Container } from "inversify";
import { GetUserInfo, GetUserInfoImpl } from "./app/usecases/GetUserInfo";
import { Login, LoginImpl } from "./app/usecases/Login";
import { Logout, LogoutImpl } from "./app/usecases/Logout";
import { UpdateBasicProfile, UpdateBasicProfileImpl } from "./app/usecases/UpdateBasicProfile";
import { UpdatePassword, UpdatePasswordImpl } from "./app/usecases/UpdatePassword";
import UserRepository from "./domain/userRepository";
import UserRepositoryImpl from "./infra/UserRepositoryImpl";

export function injectUser(container: Container) {
    container
        .bind<UserRepository>("UserRepository")
        .to(UserRepositoryImpl)
        .inSingletonScope();

    container.bind<Login>("Login").to(LoginImpl).inSingletonScope();

    container
        .bind<GetUserInfo>("GetUserInfo")
        .to(GetUserInfoImpl)
        .inSingletonScope();
    container
        .bind<UpdateBasicProfile>("UpdateBasicProfile")
        .to(UpdateBasicProfileImpl)
        .inSingletonScope(); 
    container
        .bind<UpdatePassword>("UpdatePassword")
        .to(UpdatePasswordImpl)
        .inSingletonScope(); 

    container.bind<Logout>("Logout").to(LogoutImpl).inSingletonScope();
}
