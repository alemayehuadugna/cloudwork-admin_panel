import { RouteConfig } from "vue-router/types/router";
import Layout from "@/_sharedKernel/layout/index.vue";

export const transactionAsyncRoutes: RouteConfig[] = [
	{
		path: "/payments",
		component: Layout,
		redirect: "/payments/transactions",
		meta: {
			title: "Payments",
			icon: "transfer",
			roles: ["Admin", "Employee"],
			alwaysShow: true
		},
		children: [
			{
				path: "transactions",
				component: () => import("@/modules/transaction/interface/views/transaction.vue"),
				name: "Transaction",
				meta: {
					title: "Transaction",
					// roles: ["admin"]
				}
			},
			{
				path: "deposit",
				component: () => import("@/modules/transaction/interface/views/deposit.vue"),
				name: "Deposit",
				meta: {
					title: "Deposit"
					// if do not set roles, means: this page does not require permission
				}
			},
			{
				path: "withdraw",
				component: () => import("@/modules/transaction/interface/views/withdraw.vue"),
				name: "Withdraw",
				meta: {
					title: "Withdraw",

				}
			}
		]
	},
];
