import { Container } from "inversify";
import {
    ChangeClientState,
    ChangeClientStateImpl,
} from "./app/usecase/ChangeClientState";
import { DeleteClient, DeleteClientImpl } from "./app/usecase/deleteClient";
import { GetClient, GetClientImpl } from "./app/usecase/GetClient";
import { ListClients, ListClientsImpl } from "./app/usecase/listClients";
import { SearchClientImpl, SearchClients } from "./app/usecase/SearchClient";
import { VerifyClient, VerifyClientImpl } from "./app/usecase/verifyClient";
import { ClientRepository } from "./domain/clientRepository";
import ClientRepositoryImpl from "./infra/clientRepositoryImpl";

export function injectClient(container: Container) {
    container
        .bind<ClientRepository>("ClientRepository")
        .to(ClientRepositoryImpl)
        .inSingletonScope();
    container
        .bind<ListClients>("ListClients")
        .to(ListClientsImpl)
        .inSingletonScope();
    container
        .bind<ChangeClientState>("ChangeClientState")
        .to(ChangeClientStateImpl)
        .inSingletonScope();
    container.bind<GetClient>("GetClient").to(GetClientImpl).inSingletonScope();
    container
        .bind<VerifyClient>("VerifyClient")
        .to(VerifyClientImpl)
        .inSingletonScope();
    container
        .bind<DeleteClient>("DeleteClient")
        .to(DeleteClientImpl)
        .inSingletonScope();
    container
        .bind<SearchClients>("SearchClient")
        .to(SearchClientImpl)
        .inSingletonScope();
}
