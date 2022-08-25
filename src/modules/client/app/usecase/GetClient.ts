import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Client } from "../../domain/client";
import { ClientRepository } from "../../domain/clientRepository";

export interface GetClient {
    execute(payload: string): Promise<Either<Failure, Client>>;
}

@injectable()
export class GetClientImpl implements GetClient {
    constructor(
        @inject("ClientRepository") private clientRepository: ClientRepository
    ) {}

   async execute(payload: string): Promise<Either<Failure, Client>> {
        return await this.clientRepository.getClient(payload);
    }
}
