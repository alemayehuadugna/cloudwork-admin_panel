import { RouteConfig } from "vue-router";
import Layout from "@/_sharedKernel/layout/index.vue";
import ClientsList from "@/modules/client/interface/views/clients/index.vue";
import ClientDetail from "@/modules/client/interface/views/clients/components/detail/index.vue";

export const clientAsyncRoutes: RouteConfig[] = [
    {
        path: "",
        component: Layout,
        name: "Clients",
        children: [
            {
                path: "/clients",
                component: ClientsList,
                name: "Client Management",
                meta: {
                    title: "Clients",
                    icon: "users",
                    roles: ["Admin", "Employee"]
                }
            },
            {
                path: "/clients/:id",
                component: ClientDetail,
                name: "View Client",
                meta: {
                    title: "View Client",
                    noCache: true,
                    activeMenu: "/clients",
                    hidden: true
                }
            }
        ]
    }
];