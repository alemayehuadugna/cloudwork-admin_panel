import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import UserRepository from "../../domain/userRepository";

type LoginParams = {
    email: string;
    password: string;
};

export interface Login {
    execute(payload: LoginParams): Promise<Either<Failure, string>>;
}

@injectable()
export class LoginImpl implements Login {
    constructor(
        @inject("UserRepository") private userRepository: UserRepository
    ) {}

    async execute(payload: LoginParams): Promise<Either<Failure, string>> {
        return this.userRepository.Login(payload);
    }
}
