import {
    VuexModule,
    Module,
    Action,
    Mutation,
    getModule,
} from "vuex-module-decorators";
import store from "@/_core/store";
import { Message, Notification } from "element-ui";

import { ClientDTO } from "../../domain/clientRepository";
import { lazyInject } from "@/_core/di/container";
import { ListClients } from "../../app/usecase/listClients";
import { ResultPage } from "@/_core/utils/DDD";
import { ChangeClientState } from "../../app/usecase/ChangeClientState";
import { GetClient } from "../../app/usecase/GetClient";
import { Client } from "../../domain/client";
import { VerifyClient } from "../../app/usecase/verifyClient";
import { DeleteClient } from "../../app/usecase/deleteClient";
import { SearchClients } from "../../app/usecase/SearchClient";

export interface ClientState {
    clients: ClientDTO;
    page: ResultPage;
}
@Module({
    dynamic: true,
    store,
    name: "clients"
})

export class ClientStore extends VuexModule implements ClientStore {
    public clients: ClientDTO[] = [];
    public selectedClient = {};
    public test = { name: "biruk" };

    public page: ResultPage = {
        pageSize: 10,
        current: 1,
        totalPages: 0,
        totalElements: 0,
        first: true,
        last: true,
    };

    @lazyInject("ListClients")
    private listClientsUsecase!: ListClients;

    @lazyInject("ChangeClientState")
    private changeClientStateUsecase!: ChangeClientState;

    @lazyInject("GetClient")
    private getClientUsecase!: GetClient;

    @lazyInject("VerifyClient")
    private verifyClientUsecase!: VerifyClient;

    @lazyInject("DeleteClient")
    private deleteClientUsecase!: DeleteClient;

    @lazyInject("SearchClient")
    private searchClientUseCase!: SearchClients

    // mutations
    @Mutation
    setClients(clients: ClientDTO[]) {
        this.clients = clients;
    }

    @Mutation
    updateClients(index: number){
        this.clients.splice(index,1);
    }

    @Mutation
    setPageResult(page: ResultPage) {
        this.page = page;
    }

    @Mutation
    setClientChange({ state, index }) {
        this.clients[index].state = state;
    }

    @Mutation
    setSelectedClient(client: Client) {
        this.selectedClient = client;
    }

    @Mutation
    setClientVerified(index){
        this.clients[index].verified = true;
    }

    @Action({rawError: true})
    async verifyClient(payload){
        const result = await this.verifyClientUsecase.execute(payload.clientId);

        result.cata(
            (failure) => {
                Message({
                    message: "Error Verifying Client.",
                    type: "error",
                    duration: 5 * 1000
                })
            },
            (success) => {
                this.context.commit("setClientVerified", payload.index)
                Message({
                    message: "Client Has been successfully verified.",
                    type: "success",
                    duration: 5 * 1000
                });
            }
        );
    }

    // actions
    @Action({ rawError: true })
    async listClients(query: any) {
        const result = await this.listClientsUsecase.execute(query);

        result.cata(
            (failure) => {
                Notification({
                    title: "Error",
                    message: "Failed to get clients.",
                    offset: 100,
                    type: "error",
                });
            },
            (response: any) => {
                this.context.commit("setClients", response.data);
                this.context.commit("setPageResult", response.page);
            }
        );
    }

    @Action({ rawError: true })
    async changeClientState(payload: any) {
        const result = await this.changeClientStateUsecase.execute(payload);

        result.cata(
            (failure) => {
                Message({
                    message: `Error ${
                        payload.state === "ACTIVE"
                            ? "Activating"
                            : "Deactivating"
                    } Client`,
                    type: "error",
                    duration: 5 * 1000,
                });
            },
            (success) => {
                this.context.commit("setClientChange", payload);
                Message({
                    message: `Client has been successfully ${
                        payload.state === "ACTIVE"
                            ? "Activated."
                            : "Deactivated."
                    }`,
                    type: "success",
                    duration: 5 * 1000,
                });
            }
        );
    }

    @Action({ rawError: true })
    async getClient(id: string) {
        const result = await this.getClientUsecase.execute(id);
        
        result.cata(
            (_) => {
                Message({
                    message: "Error Getting Client",
                    type: "error",
                    duration: 5 * 1000,
                });
            },
            (client) => {
                this.context.commit("setSelectedClient", client);
            }
        );
    }

    @Action({rawError: true})
    async deleteClient(id: string, index: number){
        const result = await this.deleteClientUsecase.execute(id);
        result.cata(
            (failure) => {
                Message({
					message: "Error Deleting Client",
					type: "error",
					duration: 5 * 1000,
				});
            },
            (success) => {
                this.context.commit("updateClients", index)
                Message({
					message: "Client has been successfully deleted.",
					type: "success",
					duration: 5 * 1000,
				});
            }
        )
    }

    @Action
    async searchClients(query: any){
        const result = await this.searchClientUseCase.execute(query);

        result.cata(
            (failure) => {
                Notification({
					title: "Error",
					message: "Failed to search for freelancers.",
					offset: 100,
					type: "error"
				});
            },
            (response) => {
                this.context.commit("setClients", response.data);
                this.context.commit("setPageResult", response.page);
            }
        )
    }
}
