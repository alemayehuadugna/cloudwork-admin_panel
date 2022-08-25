import { Feedback } from "./feedback";
import { Either } from "monet";
import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/DDD";

type FeedbackListItemDTO = Readonly<{
    id: string;
    firstName: string;
    lastName: string;
    message: string;
    title: string;
    state: string;
  }>;

  type FilterQuery = {
    title: string | undefined,
    firstName: string | undefined
  }

type ListQuery = {
  page: number,
  limit: number,
  sort: string | undefined,
  filter: FilterQuery
}

interface FeedbackRepository {
    GetFeedbacks(listQuery: ListQuery) : Promise<Either<Failure, PaginatedQueryResult< Feedback[]>>>;
    DeleteFeedback(id: string): Promise<Either<Failure, void>>;

}

export default FeedbackRepository;

export type { FeedbackListItemDTO, ListQuery };
