import { Container } from "inversify";
import { DeleteEmployeeImpl } from "../employee/app/usecases/DeleteEmployee";
import { DeleteFeedback, DeleteFeedbackImpl } from "./app/usecases/DeleteFeedback";
import { GetFeedbacks, GetFeedbacksImpl } from "./app/usecases/GetFeedbacks";
import FeedbackRepository from "./domain/feedbackRepository";
import FeedbackRepositoryImpl from "./infra/FeedbackRepositoryImpl";

export function injectFeedback(container: Container) {
    container.bind<FeedbackRepository>("FeedbackRepository").to(FeedbackRepositoryImpl).inSingletonScope();
    container.bind<GetFeedbacks>("GetFeedbacks").to(GetFeedbacksImpl).inSingletonScope();
    container.bind<DeleteFeedback>("DeleteFeedback").to(DeleteFeedbackImpl).inSingletonScope();
}
