import { RouteConfig } from "vue-router/types/router";
import Layout from "@/_sharedKernel/layout/index.vue";

export const jobAsyncRoutes: RouteConfig[] = [
	{
		path: "/jobs",
		component: Layout,
		name: "Jobs",
		redirect: "/jobs",
		children: [
			{
				path: "list",
				component: () => import("@/modules/job/interface/views/list.vue"),
				name: "Job Management",
				meta: {
					title: "Jobs",
					icon: "briefcase",
					roles: ["Admin", "Employee"]
				}
			},
		]
	}
];