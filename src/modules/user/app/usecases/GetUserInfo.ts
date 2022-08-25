import { Failure } from "@/_core/error/failures";
import { Either } from "monet";
import { User } from "../../domain/user";
import { inject, injectable } from "inversify";
import UserRepository from "../../domain/userRepository";

export interface GetUserInfo {
    execute(): Promise<Either<Failure, User>>;
}

@injectable()
export class GetUserInfoImpl implements GetUserInfo {
    constructor(
        @inject("UserRepository") private userRepository: UserRepository
    ) {}

    async execute(): Promise<Either<Failure, User>> {
        return await this.userRepository.GetUserInfo();
    }
}
