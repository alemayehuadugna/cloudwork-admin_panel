import { RouteConfig } from "vue-router";
import Layout from "@/_sharedKernel/layout/index.vue";

export const categoryConstantRoutes: RouteConfig[] = [
    {
        path: "/categories",
        component: Layout,
		redirect: "/categories/list",
		children: [
			{
				path: "list",
				component: () => import("@/modules/category/interface/views/list.vue"),
				name: "Category",
				meta: {
					title: "Categories",
					icon: "skills",
				}
			},
		
		]
    },
];
