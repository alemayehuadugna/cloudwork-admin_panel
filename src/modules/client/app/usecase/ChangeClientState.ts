import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { ClientRepository } from "../../domain/clientRepository";

type Params = {
    clientId: string,
    state: "ACTIVE" | "DEACTIVATE";
}

export interface ChangeClientState {
    execute(payload: Params): Promise<Either<Failure, void>>;
}

@injectable()
export class ChangeClientStateImpl implements ChangeClientState {
    constructor(
        @inject("ClientRepository")
        private clientRepository: ClientRepository
    ) {}

    async execute(payload: Params): Promise<Either<Failure, void>> {
        return await this.clientRepository.changeClientState(payload);
    }
}