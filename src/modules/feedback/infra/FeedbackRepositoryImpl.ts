import { Failure, ServerFailure } from "@/_core/error/failures";
import request from "@/_core/utils/request";
import { Left, Right, Either } from "monet";
import FeedbackRepository, { FeedbackListItemDTO, ListQuery } from "../domain/feedbackRepository";
import { FeedbackMapper } from "./FeedbackMapper";
import { Feedback } from "../domain/feedback";
import { injectable } from "inversify";
import { PaginatedQueryResult } from "@/_core/utils/DDD";
import { urlGenerator } from "./urls";

@injectable()
export default class FeedbackRepositoryImpl implements FeedbackRepository {
    async DeleteFeedback(id: string): Promise<Either<Failure, void>> {
        try {
            await request({
                url: `/feedbacks/${id}`,
                method: "DELETE"
            });
            return Right(undefined);
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }
    async GetFeedbacks(listQuery: ListQuery): Promise<
        Either<Failure, PaginatedQueryResult<Feedback[]>>
    > {
        try {
            // const url = urlGenerator(props);

            const response: any = await request({
                url: "/feedbacks",
                method: "GET",
                params: listQuery
            });

            const x = FeedbackMapper.toEntities(response.data);
            const y = {
                data: FeedbackMapper.toEntities(response.data),
                page: response.page,
            };

            return Right({
                data: FeedbackMapper.toEntities(response.data),
                page: response.page,
            });
        } catch (ServerException) {
            return Left(new ServerFailure(""));
        }
    }
}
