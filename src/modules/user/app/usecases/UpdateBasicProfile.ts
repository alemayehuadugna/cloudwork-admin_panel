import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { User } from "../../domain/user";
import UserRepository, { UserDTO } from "../../domain/userRepository";


export interface UpdateBasicProfile {
    execute(id: string, data: UserDTO): Promise<Either<Failure, User>>;
}

@injectable()
export class UpdateBasicProfileImpl implements UpdateBasicProfile {
    constructor(
        @inject("UserRepository")
        private userRepository: UserRepository
    ) {}

    async execute(id: string, data: UserDTO): Promise<Either<Failure, User>> {
        return await this.userRepository.UpdateBasicProfile(id, data);
    }
}
