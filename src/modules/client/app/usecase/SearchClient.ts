import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { ClientDTO, ClientRepository } from "../../domain/clientRepository";

export interface SearchClients {
    execute({
        pagination, 
        filter
    }): Promise<Either<Failure, PaginatedQueryResult<ClientDTO[]>>>;
}

@injectable()
export class SearchClientImpl implements SearchClients{
    constructor(
        @inject("ClientRepository")
        private clientRepository: ClientRepository
    ){}
   async execute({ pagination, filter }: { pagination: any; filter: any; }): Promise<Either<Failure, PaginatedQueryResult<ClientDTO[]>>> {
    console.log("wawawawefa ldfjsdl");
    console.log(pagination);
    console.log("--------------------");
    console.log(filter);
        return await this.clientRepository.searchClient({
            pagination, 
            filter
        })
    }

    
}