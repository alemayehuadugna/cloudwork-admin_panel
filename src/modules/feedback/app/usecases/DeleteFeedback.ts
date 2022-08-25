import { Failure } from "@/_core/error/failures";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import FeedbackRepository from "../../domain/feedbackRepository";

export interface DeleteFeedback{
    execute(id: string): Promise<Either<Failure, void>>
}

@injectable()
export class DeleteFeedbackImpl implements DeleteFeedback {
    constructor(
        @inject("FeedbackRepository")
        private feedbackRepository: FeedbackRepository
    ) {}

    async execute(id: string): Promise<Either<Failure, void>> {
        console.log("the id:: ", id);
        return await this.feedbackRepository.DeleteFeedback(id);
    }
}
