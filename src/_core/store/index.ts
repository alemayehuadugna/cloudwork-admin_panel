import Vue from "vue";
import Vuex from "vuex";
import { IAppState } from "../../_sharedKernel/store/modules/app";
import { IUserState } from "../../modules/user/interface/store";
import { ITagsViewState } from "../../_sharedKernel/store/modules/tags-view";
import { IErrorLogState } from "../../_sharedKernel/store/modules/error-log";
import { IPermissionState } from "../../_sharedKernel/store/modules/permission";
import { ISettingsState } from "../../_sharedKernel/store/modules/settings";
import { EmployeeState } from "../../modules/employee/interface/store";
import { FreelancerState } from "@/modules/freelancer/interface/store";
import { JobState } from "@/modules/job/interface/store";
import { TransactionState } from "@/modules/transaction/interface/store";

Vue.use(Vuex);

export interface IRootState {
    app: IAppState;
    user: IUserState;
    employee: EmployeeState;
    tagsView: ITagsViewState;
    errorLog: IErrorLogState;
    permission: IPermissionState;
    settings: ISettingsState;
	freelancer: FreelancerState;
    jobs: JobState;
	transaction: TransactionState;
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({});
