import { Either } from "monet";
import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { Dashboard } from "./dashboard";

interface DashboardRepository {
	getAllCount(): Promise<Either<Failure, Dashboard>>;
}

export { DashboardRepository };
