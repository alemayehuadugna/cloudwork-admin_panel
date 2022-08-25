import { lazyInject } from "@/_core/di/container";
import { ResultPage } from "@/_core/utils/CQRS";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { JobDTO } from "../../domain/jobRepository";
import { ListJobs } from "../../app/usecases/ListJob";
import store from "@/_core/store";
import { Message, Notification } from "element-ui";
import { SearchJobs } from "../../app/usecases/SearchJob";
import { DeleteJob } from "../../app/usecases/DeleteJob";
import { DeleteJobForever } from "../../app/usecases/DeleteJobForever";
import { Failure } from "@/_core/error/failures";

export interface JobState {
    jobs: JobDTO[];
    page: ResultPage;
    type1: string;
    type2: string;
    type3: string;
    type4: string;
}

@Module({
    dynamic: true,
    store,
    name: "job",
})
export class JobStore extends VuexModule implements JobStore {
    public jobs: JobDTO[] = [];
    public page: ResultPage = {
        pageSize: 10,
        current: 1,
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: true,
    };
    public type1: string = "";
    public type2: string = "";
    public type3: string = "";
    public type4: string = "";

    @lazyInject("ListJobs")
    private listJobUseCase!: ListJobs;
    @lazyInject("SearchJobs")
    private searchJobsUseCase!: SearchJobs;
    @lazyInject("DeleteJob")
    private deleteJobUseCase!: DeleteJob;
    @lazyInject("DeleteJobForever")
    private deleteJobForeverUseCase!: DeleteJobForever;

    @Mutation
    setJobs(jobs: JobDTO[]) {
        this.jobs = [];
        this.jobs = jobs;
    }

    @Mutation
    setPageResult(page: ResultPage) {
        this.page = page;
    }

    @Mutation
    setProgress(payload: any) {
        this.type1 = payload.type1;
        this.type2 = payload.type2;
        this.type3 = payload.type3;
        this.type4 = payload.type4;
    }

    @Mutation
    setDelete(payload: any) {
        console.log("payload dlete; ", payload);
        this.jobs[payload.index].progress = payload.progress;
    }

    @Action({ rawError: true })
    async listJobs(payload: any) {
        console.log("store payload: ", payload.type2);
        const result = await this.listJobUseCase.execute(payload.query);
        result.cata(
            (failure) => {
                Notification({
                    title: "Error",
                    message: "Failed to get jobs.",
                    offset: 100,
                    type: "error",
                });
            },
            (response: any) => {
                this.context.commit("setJobs", response.data);
                this.context.commit("setPageResult", response.page);
                this.context.commit("setProgress", payload);
            }
        );
    }

    @Action({ rawError: true })
	async searchJobs(query: any) {
		const result = await this.searchJobsUseCase.execute(query);
		result.cata(
			(failure) => {
				Notification({
					title: "Error",
					message: "Failed to search for freelancers.",
					offset: 100,
					type: "error"
				});
			},
			(response) => {
				this.context.commit("setJobs", response.data);
				this.context.commit("setPageResult", response.page);
			}
		);
	}

    @Action({ rawError: true })
    async deleteJob(id: string) {
        await this.deleteJobUseCase.execute(id);
        this.context.commit("setDeleteForever");
    }

    @Action({ rawError: true })
    async deleteJobForever(id: string) {
        console.log("delete forever: ", id);
        const result = await this.deleteJobForeverUseCase.execute(id);
        result.cata(
            (failure) => {
                Message({
					message: "Error Deleting Freelancer",
					type: "error",
					duration: 5 * 1000,
				});
            },
            (success) => {
                Message({
					message: "Job has been successfully deleted forever.",
					type: "success",
					duration: 5 * 1000,
				});
			}
        );
    }
}
