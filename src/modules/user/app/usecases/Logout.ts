import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import UserRepository from "../../domain/userRepository";

export interface Logout {
    execute(): Promise<Either<Failure, void>>;
}

@injectable()
export class LogoutImpl implements Logout {
    constructor(
        @inject("UserRepository") private userRepository: UserRepository
    ) {}

    async execute(): Promise<Either<Failure, void>> {
        return await this.userRepository.Logout();
    }
}
