import { RouteConfig } from "vue-router";
import Layout from "@/_sharedKernel/layout/index.vue";

export const dashboardConstantRoutes: RouteConfig[] = [
	{
		path: "/dashboards",
		component: Layout,
		redirect: "/dashboards/list",
		children: [
			{
				path: "list",
				component: () => import("@/modules/dashboard/interface/views/list.vue"),
				name: "Dashboard",
				meta: {
					title: "Dashboards",
					icon: "dashboard",
				}
			}
		]
	}
];
