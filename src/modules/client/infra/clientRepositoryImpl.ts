import { Failure, ServerFailure } from "@/_core/error/failures";
import request from "@/_core/utils/request";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { Either, Left, Right } from "monet";
import { ClientDTO, ClientRepository } from "../domain/clientRepository";
import { ClientMapper } from "./clientMapper";
import { injectable } from "inversify";
import { Console } from "console";
import { Client } from "../domain/client";
import axios from "axios";

@injectable()
export default class ClientRepositoryImpl implements ClientRepository {
    async searchClient({ pagination, filter }: { pagination: any; filter: any; }): Promise<Either<Failure, PaginatedQueryResult<ClientDTO[]>>> {
        try {
            const response: any = await request({
                url: "/clients/search",
                method: "GET",
                params: {...pagination, filter}
            });

            return Right({
                data: ClientMapper.toEntities(response.data),
                page: response.page
            })
        } catch (error) {
            if (axios.isAxiosError(error)) {
				return Left(new ServerFailure(error.response?.data.error));
			}
			return Left(new ServerFailure("unexpected server failure"));
        }
    }
    async listClients({
        pagination,
        filter,
        sort,
    }: any): Promise<Either<Failure, PaginatedQueryResult<ClientDTO[]>>> {

        try {
            const response: any = await request({
                url: "/clients",
                method: "GET",
                params: { ...pagination, filter, sort },
            });
            console.log("impl", filter);
            return Right({
                data: ClientMapper.toEntities(response.data),
                page: response.page,
            });
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }

    async changeClientState({
        clientId,
        state,
    }: any): Promise<Either<Failure, void>> {
        try {
            await request.patch(`/clients/${clientId}/state`, { state });
            return Right(undefined);
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }

    async getClient(id: string): Promise<Either<Failure, Client>> {
        try {
            const response: any = await request.get(`/clients/${id}`);
            console.log("from data base", response);
            return Right(ClientMapper.toEntity(response));
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }

    async verifyClient(id: string): Promise<Either<Failure, string>> {
        try {
            const response: any = await request.patch(`/clients/verify/${id}`);
            console.log("after return", response);

            return Right(response.clientId);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return Left(new ServerFailure(error.response?.data.error));
            }

            return Left(new ServerFailure("unexpected server failure"));
        }
    }

    async deleteClient(id: string): Promise<Either<Failure, string>> {
        try {
            const response: any = await request.delete(`/clients/${id}`);
            return Right(response.clientId);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return Left(new ServerFailure(error.response?.data.error));
            }
            return Left(new ServerFailure("unexpected server failure"));
        }
    }

    
}
