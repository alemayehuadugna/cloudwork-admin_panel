import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { ClientRepository } from "../../domain/clientRepository";

export interface DeleteClient {
    execute(payload: string): Promise<Either<Failure, string>>;
}

@injectable()
export class DeleteClientImpl implements DeleteClient{
    constructor(
        @inject("ClientRepository")
        private clientRepository: ClientRepository
    ){}

   async execute(payload: string): Promise<Either<Failure, string>> {
        return await this.clientRepository.deleteClient(payload);
    }

}