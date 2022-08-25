import { RouteConfig } from "vue-router";
import Layout from "@/_sharedKernel/layout/index.vue";

export const userConstantRoutes: RouteConfig[] = [
	{
		path: "/login",
		component: () =>
			import("@/modules/user/interface/views/login/index.vue"),
		meta: { hidden: true },
	},
	{
		path: "/",
		component: Layout,
		redirect: "/dashboard",
		children: [
			{
				path: "Dashboard",
				component: () =>
					import(
						"@/modules/dashboard/interface/views/dashboardIndex.vue"
					),
				name: "Dashboard",
				meta: {
					title: "Dashboard",
					icon: "gauge",
					affix: true,
				},
			},
		],
	},
	{
		path: "/profile",
		component: Layout,
		redirect: "/profile/index",
		meta: { hidden: true },
		children: [
			{
				path: "index",
				component: () => import("@/modules/user/interface/views/profile/index.vue"),
				name: "Profile",
				meta: {
					title: "profile",
					icon: "user",
					noCache: true
				}
			}
		]
	},
];
