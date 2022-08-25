import { lazyInject } from "@/_core/di/container";
import store from "@/_core/store";
import { PaginatedQueryResult, ResultPage } from "@/_core/utils/CQRS";
import { Message, Notification } from "element-ui";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import { DeactivateFreelancer } from "../../app/usecase/DeactivateFreelancer";
import { DeleteFreelancer } from "../../app/usecase/DeleteFreelancer";
import { GetFreelancer } from "../../app/usecase/GetFreelancer";
import { ListFreelancers } from "../../app/usecase/ListFreelancer";
import { SearchFreelancers } from "../../app/usecase/SearchFreelancer";
import { VerifyFreelancer } from "../../app/usecase/VerifyFreelancer";
import { Freelancer } from "../../domain/freelancer";
import { FreelancerDTO } from "../../domain/freelancerRepository";

export interface FreelancerState {
	freelancers: FreelancerDTO[];
	selectedFreelancer?: Freelancer;
	page: ResultPage;
}

@Module({
	dynamic: true,
	store,
	name: "freelancer",
})
export class FreelancerStore extends VuexModule implements FreelancerState {
	public freelancers: FreelancerDTO[] = [];
	public selectedFreelancer?: Freelancer;
	public page: ResultPage = {
		pageSize: 10,
		current: 1,
		totalPages: 0,
		totalElements: 0,
		first: true,
		last: true,
	};

	@lazyInject("ListFreelancers")
	private listFreelancersUsecase!: ListFreelancers;

	@lazyInject("DeleteFreelancer")
	private deleteFreelancerUsecase!: DeleteFreelancer;

	@lazyInject("GetFreelancer")
	private getFreelancerUsecase!: GetFreelancer;

	@lazyInject("DeactivateFreelancer")
	private deactivateFreelancerUsecase!: DeactivateFreelancer;

	@lazyInject("SearchFreelancers")
	private searchFreelancersUsecase!: SearchFreelancers;

	@lazyInject("VerifyFreelancer")
	private verifyFreelancerUseCase!: VerifyFreelancer;

	@Mutation
	setFreelancers(freelancers: FreelancerDTO[]) {
		this.freelancers = freelancers;
	}

	@Mutation
	setActivation({ index, state }: any) {
		this.freelancers[index].state = state;
	}

	@Mutation
	setPageResult(page: ResultPage) {
		this.page = page;
	}

	@Mutation
	setSelectedFreelancer(freelancer: Freelancer) {
		this.selectedFreelancer = freelancer;
	}

	@Mutation
	setFreelancerVerified(index) {
		this.freelancers[index].verified = true;
	}


	@Action
	async listFreelancers(query: any) {
		const result = await this.listFreelancersUsecase.execute(query);
		result.cata(
			(failure) => {
				Notification({
					title: "Error",
					message: "Failed to get freelancers.",
					offset: 100,
					type: "error"
				});
			},
			(response: any) => {
				this.context.commit("setFreelancers", response.data);
				this.context.commit("setPageResult", response.page);
			}
		);
	}

	@Action
	async searchForFreelancers(query: any) {
		const result = await this.searchFreelancersUsecase.execute(query);
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
				this.context.commit("setFreelancers", response.data);
				this.context.commit("setPageResult", response.page);
			}
		);
	}

	@Action({ rawError: true })
	async deleteFreelancer(id: string) {
		const result = await this.deleteFreelancerUsecase.execute(id);
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
					message: "Freelancer has been successfully deleted.",
					type: "success",
					duration: 5 * 1000,
				});
			}
		);
	}

	
	@Action({ rawError: true })
	async verityFreelancers(payload) {
		const result = await this.verifyFreelancerUseCase.execute(payload.freelancerId);
		result.cata(
			(failure) => {
				Message({
					message: "Error Verifying Freelancer",
					type: "error",
					duration: 5 * 1000,
				});
			},
			(_) => {
				this.context.commit("setFreelancerVerified", payload.index);
				Message({
					message: "Freelancer has been successfully Verified.",
					type: "success",
					duration: 5 * 1000,
				});
			}
		)
	}

	@Action({ rawError: true })
	async deactivateFreelancer({ freelancerId, index, state }: any) {
		const result = await this.deactivateFreelancerUsecase.execute({ freelancerId, state });
		result.cata(
			(failure) => {
				Message({
					message: "Error Deactivating Freelancer",
					type: "error",
					duration: 5 * 1000,
				});
			},
			(success) => {
				this.context.commit("setActivation", { index, state });
				Message({
					message: "Freelancer has been successfully Deactivated.",
					type: "success",
					duration: 5 * 1000,
				});
			}
		);
	}

	@Action({ rawError: true })
	async getFreelancer(id: string) {
		const result = await this.getFreelancerUsecase.execute(id);
		result.cata(
			(_) => {
				Message({
					message: "Error Getting Freelancer",
					type: "error",
					duration: 5 * 1000,
				});
			},
			(freelancer) => {
				this.context.commit("setSelectedFreelancer", freelancer);
			}
		);
	}
}
