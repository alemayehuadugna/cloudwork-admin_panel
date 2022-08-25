import { Container } from "inversify";
import { DeleteJob, DeleteJobImpl } from "./app/usecases/DeleteJob";
import { DeleteJobForever, DeleteJobForeverImpl } from "./app/usecases/DeleteJobForever";
import { ListJobs, ListJobsImpl } from "./app/usecases/ListJob";
import { SearchJobImpl, SearchJobs } from "./app/usecases/SearchJob";
import { JobRepository } from "./domain/jobRepository";
import JobRepositoryImpl from "./infra/JobRepositoryImpl";

export function injectJob(container: Container) {
	container.bind<JobRepository>("JobRepository")
		.to(JobRepositoryImpl)
		.inSingletonScope();
	container.bind<ListJobs>("ListJobs")
		.to(ListJobsImpl)
		.inSingletonScope;
	container.bind<SearchJobs>("SearchJobs")
		.to(SearchJobImpl)
		.inSingletonScope;
	container.bind<DeleteJob>("DeleteJob")
		.to(DeleteJobImpl)
		.inSingletonScope;
	container.bind<DeleteJobForever>("DeleteJobForever")
		.to(DeleteJobForeverImpl)
		.inSingletonScope;
}