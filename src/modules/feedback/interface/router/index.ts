import { RouteConfig } from "vue-router";
import Layout from "@/_sharedKernel/layout/index.vue";

export const feedbackConstantRoutes: RouteConfig[] = [
	{
		path: "/feedbacks",
		component: Layout,
		redirect: "/feedbacks/list",
		children: [
			{
				path: "list",
				component: () => import("@/modules/feedback/interface/views/list.vue"),
				name: "Feedback",
				meta: {
					title: "Feedbacks",
					icon: "feedback",
				}
			}
		]
	}
];
