import { Container } from "inversify";
import { DashboardRepository } from "./domain/dashboardRepository";
import DashboardRepositoryImpl from './infra/DashboardRepositoryImpl';
import { GetAllCount, GetAllCountImpl } from './app/usecases/GetAllCount';

export function injectDashboard(container: Container) {
	container
		.bind<DashboardRepository>("DashboardRepository")
		.to(DashboardRepositoryImpl)
		.inSingletonScope();
	container
		.bind<GetAllCount>("GetAllCount")
		.to(GetAllCountImpl)
		.inSingletonScope();
}