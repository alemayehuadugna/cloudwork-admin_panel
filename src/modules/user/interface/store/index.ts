import { Failure } from '@/_core/error/failures';
import { UpdatePassword } from './../../app/usecases/UpdatePassword';
import {
    VuexModule,
    Module,
    Action,
    Mutation,
    getModule,
} from "vuex-module-decorators";
import { getToken, setToken, removeToken } from "@/_core/utils/cookies";
import router, { resetRouter } from "@/_core/router";
import { TagsViewModule } from "../../../../_sharedKernel/store/modules/tags-view";
import store from "@/_core/store";
import { Login } from "../../app/usecases/Login";
import { GetUserInfo } from "../../app/usecases/GetUserInfo";
import { Logout } from "../../app/usecases/Logout";
import { lazyInject } from "@/_core/di/container";
import { Message } from "element-ui";
import { UpdateBasicProfile } from "../../app/usecases/UpdateBasicProfile";

export interface IUserState {
    token: string;
    uid: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    gender: string;
    roles: string[];
    profilePicture: string;

}

@Module({ dynamic: true, store, name: "UserStore" })
export class UserStore extends VuexModule implements UserStore {
    public token = getToken() || "";
    public uid = "";
    public firstName = "";
    public lastName = "";
    public phone = "";
    public email = "";
    public gender = "";
    public profilePicture = "";
    public roles: string[] = [];

    @lazyInject("Login") private login!: Login;
    @lazyInject("GetUserInfo") private getUserInfo!: GetUserInfo;
    @lazyInject("Logout") private logout!: Logout;
    @lazyInject("UpdateBasicProfile") private updateBasicProfileUseCase!: UpdateBasicProfile;
    @lazyInject("UpdatePassword") private updatePassword!: UpdatePassword;

    @Mutation
    private SET_TOKEN(token: string) {
        this.token = token;
    }

    @Mutation
    private SET_UID(uid: string) {
        this.uid = uid;
    }

    @Mutation
    private SET_FIRST_NAME(firstName: string) {
        this.firstName = firstName;
    }

    @Mutation
    private SET_LAST_NAME(lastName: string) {
        this.lastName = lastName;
    }

    @Mutation
    private SET_PHONE(phone: string) {
        this.phone = phone;
    }

    @Mutation
    private SET_EMAIL(email: string) {
        this.email = email;
    }

    @Mutation
    private SET_GENDER(gender: string) {
        this.gender = gender;
    }

    @Mutation
    private SET_PROFILE_PICTURE(profilePicture: string) {
        this.profilePicture = profilePicture;
    }

    @Mutation
    private SET_ROLES(roles: string[]) {
        this.roles = roles;
    }


    @Action
    public async Login(userInfo: { email: string; password: string }) {
        const result = await this.login.execute(userInfo);
        result.cata(
            (error) => {
                Message({
                    message: error.message,
                    type: "error",
                    duration: 5 * 1000,
                });
            },
            (token) => {
                setToken(token);
                this.SET_TOKEN(token);
            }
        );
    }

    @Action
    public async GetUserInfo() {
        if (this.token === "") {
            throw Error("GetUserInfo: token is undefined!");
        }
        const result = await this.getUserInfo.execute();
        result.cata(
            (_) => {
                throw Error("Verification failed, please Login again.");
            },
            (user) => {
                if (!user.roles || user.roles.length <= 0) {
                    throw Error("GetUserInfo: roles must be a non-null array!");
                }
                this.SET_UID(user.uid);
                this.SET_FIRST_NAME(user.firstName);
                this.SET_LAST_NAME(user.lastName);
                this.SET_PHONE(user.phone);
                this.SET_EMAIL(user.email);
                this.SET_GENDER(user.gender);
                this.SET_PROFILE_PICTURE(user.profilePicture);
                this.SET_ROLES(user.roles);
            }
        );
    }

    @Action
    public async LogOut() {
        if (this.token === "") {
            throw Error("LogOut: token is undefined!");
        }
        const result = await this.logout.execute();
        result.cata(
            (_) => {
                throw Error("Failed To Logout!");
            },
            (success) => {
                removeToken();
                resetRouter();

                // Reset visited views and cached views
                TagsViewModule.delAllViews();
                this.SET_TOKEN("");
                this.SET_ROLES([]);
            }
        );
    }

    @Action
    public ResetToken() {
        removeToken();
        this.SET_TOKEN("");
        this.SET_ROLES([]);
    }

    @Action({ rawError: true })
    async updateBasicProfile(data: any) {
        console.log("updated data ", data)
        await this.updateBasicProfileUseCase.execute(data.id, data);
    }
    @Action({ rawError: true })
    async UpdatePassword(data: any) {
        console.log("updated data ", data)
        const result= await this.updatePassword.execute(data.id, data);
        
        result.cata(
            (error) => {
                console.log('error');
                Message({
                    message: "Wrong Password",
                    type: "error",
                    duration: 5 * 1000,
                });
            },
            (result) => {
                console.log('success');
                Message({
                    message: "Password Updated",
                    type: "success",
                    duration: 5 * 1000,
                });
            }
        )
            
    }
}

export const UserModule = getModule(UserStore);
