import { RouteConfig } from "vue-router";
import { component } from "vue/types/umd";
import Layout from "@/_sharedKernel/layout/index.vue";

export const freelancerAsyncRoutes: RouteConfig[] = [
    {
        path: "/freelancers",
        component: Layout,
		name: "Freelancers",
		redirect: "/freelancers",
		children: [
			{
				path: "list",
				component: () => import("@/modules/freelancer/interface/views/list.vue"),
				name: "Freelancer Management",
				meta: {
					title: "Freelancers",
					icon: "users",
					roles: ["Admin", "Employee"]
				}
			},
			{
				path: ":id",
				component: () => import("@/modules/freelancer/interface/views/view.vue"),
				name: "ViewFreelancer",
				meta: {
					title: "View Freelancer",
					noCache: true,
					activeMenu: "/freelancers",
					hidden: true
				}
			}
		]
    },
];
