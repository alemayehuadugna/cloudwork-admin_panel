import { Failure } from "@/_core/error/failures";
import { PaginatedQueryResult } from "@/_core/utils/CQRS";
import { Either } from "monet";
import { Address, Freelancer, Rating } from "./freelancer";

type FreelancerDTO = {
	freelancerId: string,
	firstName: string,
	lastName: string,
	phone: string,
	email: string,
	userName: string,
	gender: string,
	expertise: string,
	joinedDate: Date,
	verified: boolean,
	state: string,
};

interface FreelancerRepository {
	findFreelancers({ pagination, filter, sort }): Promise<Either<Failure, PaginatedQueryResult<FreelancerDTO[]>>>;
	getFreelancer(id: string): Promise<Either<Failure, Freelancer>>;
	deleteFreelancer(id: string): Promise<Either<Failure, void>>;
	deactivateFreelancer({ id, state }: any): Promise<Either<Failure, void>>;
	searchForFreelancer({ pagination, filter }): Promise<Either<Failure, PaginatedQueryResult<FreelancerDTO[]>>>;
	verifyFreelancer(id: string): Promise<Either<Failure, void>>;
}

export { FreelancerRepository };
export type { FreelancerDTO };
