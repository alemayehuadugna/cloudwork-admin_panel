import { RouteConfig } from "vue-router";
import Layout from "@/_sharedKernel/layout/index.vue";

export const employeeAsyncRoutes: RouteConfig[] = [
    {
        path: "/employees",
        component: Layout,
        redirect: "/employees",
        name: "Employee",
        meta: {
            // title: "Employee",
            roles: ["Admin"]
        },
        children: [
            {
                path: "list",
                component: () => import("@/modules/employee/interface/views/index.vue"),
                name: "Employee Management",
                meta: {
                    title: "Employee",
                    icon: "users",
                    roles: ["Admin"]
                }
            }
        ]

    }
];
