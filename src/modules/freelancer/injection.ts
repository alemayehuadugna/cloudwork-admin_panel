import { Container } from "inversify";
import { DeactivateFreelancer, DeactivateFreelancerImpl } from "./app/usecase/DeactivateFreelancer";
import { DeleteFreelancer, DeleteFreelancerImpl } from "./app/usecase/DeleteFreelancer";
import { GetFreelancer, GetFreelancerImpl } from "./app/usecase/GetFreelancer";
import { ListFreelancers, ListFreelancersImpl } from "./app/usecase/ListFreelancer";
import { SearchFreelancers, SearchFreelancersImpl } from "./app/usecase/SearchFreelancer";
import { FreelancerRepository } from "./domain/freelancerRepository";
import FreelancerRepositoryImpl from "./infra/FreelancerRepositoryImpl";
import { VerifyFreelancer, VerifyFreelancerImpl } from './app/usecase/VerifyFreelancer';

export function injectFreelancer(container: Container) {
	container
		.bind<FreelancerRepository>("FreelancerRepository")
		.to(FreelancerRepositoryImpl)
		.inSingletonScope();
	container
		.bind<ListFreelancers>("ListFreelancers")
		.to(ListFreelancersImpl)
		.inSingletonScope();
	container
		.bind<DeleteFreelancer>("DeleteFreelancer")
		.to(DeleteFreelancerImpl)
		.inSingletonScope();
	container
		.bind<DeactivateFreelancer>("DeactivateFreelancer")
		.to(DeactivateFreelancerImpl)
		.inSingletonScope();
	container
		.bind<GetFreelancer>("GetFreelancer")
		.to(GetFreelancerImpl)
		.inSingletonScope();
	container
		.bind<SearchFreelancers>("SearchFreelancers")
		.to(SearchFreelancersImpl)
		.inSingletonScope();
	container
		.bind<VerifyFreelancer>("VerifyFreelancer")
		.to(VerifyFreelancerImpl)
		.inSingletonScope();
}