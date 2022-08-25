import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { ClientDTO, ClientRepository } from "../../domain/clientRepository";

export interface ListClients {
    execute({
        pagination,
        filter,
        sort,
    }: any): Promise<Either<Failure, PaginatedQueryResult<ClientDTO[]>>>;
}

@injectable()
export class ListClientsImpl implements ListClients {
    constructor(
        @inject("ClientRepository") private clientRepository: ClientRepository
    ) {}

    async execute({
        pagination,
        filter,
        sort,
    }: any): Promise<Either<Failure, PaginatedQueryResult<ClientDTO[]>>> {
        return await this.clientRepository.listClients({
            pagination,
            filter,
            sort,
        });
    }
}
