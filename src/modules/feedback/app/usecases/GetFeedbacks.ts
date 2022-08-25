import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/DDD";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Feedback } from "../../domain/feedback";
import FeedbackRepository, { ListQuery } from "../../domain/feedbackRepository";

export interface GetFeedbacks {
    execute(listQuery: ListQuery): Promise<Either<Failure, PaginatedQueryResult<Feedback[]>>>;
}

@injectable()
export class GetFeedbacksImpl implements GetFeedbacks {
    constructor(@inject("FeedbackRepository") private feedbackRepository: FeedbackRepository) {}

    async execute(listQuery: ListQuery): Promise<Either<Failure, PaginatedQueryResult<Feedback[]>>> {
        return await this.feedbackRepository.GetFeedbacks(listQuery);
    }
}
