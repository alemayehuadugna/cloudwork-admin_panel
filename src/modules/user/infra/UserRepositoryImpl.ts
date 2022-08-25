import { injectable } from "inversify";
import { User } from "../domain/user";
import UserRepository, { UserDTO, UserDTO2 } from "../domain/userRepository";
import request from "@/_core/utils/request";
import { Failure, ServerFailure } from "@/_core/error/failures";
import { Either, Left, Right } from "monet";
import { UserMapper } from "./UserMapper";
import axios from "axios";

@injectable()
export default class UserRepositoryImpl implements UserRepository {
	async GetUserInfo(): Promise<Either<Failure, User>> {
		try {
			const response = await request.get("/employee/me");
			return Right(UserMapper.toEntity(response));
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}

			return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async Logout(): Promise<Either<Failure, void>> {
		try {
			console.log("logged out");
			return Right(undefined);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.message));
			}

			return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async Login(payload: {
		email: string;
		password: string;
	}): Promise<Either<Failure, string>> {
		try {
			const data = {
				email: payload.email,
				password: payload.password,
			};
			const response: any = await request.post("/employees/login", data);
			return Right(response);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}

			return Left(new ServerFailure("unexpected server failure"));
		}
	}
	async UpdateBasicProfile(
        id: string,
        data: UserDTO
    ): Promise<Either<Failure, User>> {
        try {
            const response = await request({
                url: `/employees/me/basic${id}`,
                method: "PATCH",
                data,
            });

            return Right(UserMapper.toEntity(response.data));
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }
	async UpdatePassword(
		id: string,
        data: UserDTO2
    ): Promise<Either<Failure, void>> {
        try {
            const response = await request({
                url: `/employees/me/changePassword${id}`,
                method: "PATCH",
                data,
            });

            return Right(undefined);
        } catch (ServerException) {
			console.log('server Exception: ', ServerException)
            return Left(new ServerFailure(""));
        }

		}
    }

