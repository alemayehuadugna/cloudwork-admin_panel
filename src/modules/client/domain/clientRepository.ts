import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { Either } from "monet";
import { Client } from "./client";

type ClientDTO = {
    clientId: string;
    firstName: string;
    lastName: string;
    userName: string;
    phone: string;
    email: string;
    createdAt: Date;
    verified: boolean;
    state: string;
}

interface ClientRepository {
    listClients({ pagination, filter, sort }): Promise<Either<Failure, PaginatedQueryResult<ClientDTO[]>>>
    changeClientState({ clientId, state }: any): Promise<Either<Failure, void>>;
    getClient(id: string): Promise<Either<Failure, Client>>;
    verifyClient(id: string): Promise<Either<Failure, string>>;
    deleteClient(id: string): Promise<Either<Failure, string>>;
    searchClient({pagination, filter}): Promise<Either<Failure, PaginatedQueryResult<ClientDTO[]>>>;
    
}

export { ClientRepository };
export type { ClientDTO };