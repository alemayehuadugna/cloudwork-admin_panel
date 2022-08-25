import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

/* modules */
import { userConstantRoutes } from "@/modules/user/interface/router";
import { employeeAsyncRoutes } from "@/modules/employee/interface/router";
import { freelancerAsyncRoutes } from "@/modules/freelancer/interface/router";
import { feedbackConstantRoutes } from "@/modules/feedback/interface/router";
import { clientAsyncRoutes } from "@/modules/client/interface/router";
import { jobAsyncRoutes } from "@/modules/job/interface/router";
import { categoryConstantRoutes } from "@/modules/category/interface/router";
import { transactionAsyncRoutes } from "@/modules/transaction/interface/router";

Vue.use(VueRouter);

export const constantRoutes: RouteConfig[] = [
	...userConstantRoutes,
	...categoryConstantRoutes,
	...feedbackConstantRoutes,
];

export const asyncRoutes: RouteConfig[] = [
	...employeeAsyncRoutes,
	...freelancerAsyncRoutes,
	...clientAsyncRoutes,
	...jobAsyncRoutes,
	...transactionAsyncRoutes,
];

const createRouter = () =>
	new VueRouter({
		// mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
		scrollBehavior: (to, from, savedPosition) => {
			if (savedPosition) {
				return savedPosition;
			} else {
				return { x: 0, y: 0 };
			}
		},
		mode: "history",
		base: process.env.BASE_URL,
		routes: constantRoutes,
	});

const router = createRouter();

export function resetRouter() {
	const newRouter = createRouter();
	(router as any).matcher = (newRouter as any).matcher; // reset router
}

export default router;
