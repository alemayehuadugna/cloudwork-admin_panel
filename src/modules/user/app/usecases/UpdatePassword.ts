import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { User } from "../../domain/user";
import UserRepository, { UserDTO, UserDTO2 } from "../../domain/userRepository";

// type UpdatePasswordParam={
//     oldPassword: string;
//     newPassword: string;
// }

export interface UpdatePassword {
    execute(id: string, data: UserDTO2): Promise<Either<Failure, void>>;
}

@injectable()
export class UpdatePasswordImpl implements UpdatePassword {
    constructor(
        @inject("UserRepository") private userRepository: UserRepository
    ) {}

    async execute(id: string, data: UserDTO2): Promise<Either<Failure, void>>{
        return await this.userRepository.UpdatePassword(id, data);
    }
}
