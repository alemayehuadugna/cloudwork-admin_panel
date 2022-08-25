import { lazyInject } from "@/_core/di/container";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "@/_core/store";
import { Notification } from "element-ui";
import { Dashboard } from "../../domain/dashboard";
import { GetAllCount } from '../../app/usecases/GetAllCount';

export interface DashboardState {
	dashboards: Dashboard;
}

@Module({
	dynamic: true,
	store,
	name: "dashboard",
})
export class DashboardStore extends VuexModule implements DashboardStore {
	public dashboards : any = {};

	@lazyInject("GetAllCount")
	private getAllCountUseCase!: GetAllCount;

	@Mutation
	setDashboard(dashboards: Dashboard) {
		this.dashboards = dashboards;
	}


	@Action({ rawError: true })
	async getAllCount() {
		console.log("call in GetAllCount");
		const result = await this.getAllCountUseCase.execute();
		result.cata(
			(_) => {
				Notification({
					title: "Error",
					message: "Failed to Get Data for Dashboard.",
					offset: 100,
					type: "error"
				});
			},
			(response) => {
				this.context.commit('setDashboard', response);
			}
		);
	}
}
