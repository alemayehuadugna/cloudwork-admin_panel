import { Freelancer } from "../domain/freelancer";
import { FreelancerDTO } from "../domain/freelancerRepository";
import dayjs from "dayjs";

const FreelancerMapper = {
	toEntity(json: any): Freelancer {
		const freelancer: Freelancer = {
			freelancerId: json.id.value,
			firstName: json.firstName,
			lastName: json.lastName,
			phone: json.phone,
			email: json.email,
			password: json.password,
			gender: json.gender,
			skills: json.skills,
			overview: json.overview,
			hourlyRate: json.hourlyRate,
			socialLinks: json.socialLinks,
			address: json.address,
			language: json.language,
			education: json.education,
			employments: json.employments,
			otherExperience: json.otherExperience,
			testimonials: json.testimonials,
			profilePicture: json.profilePicture,
			userName: json.userName,
			earning: json.earning,
			rating: json.rating,
			workHistory: json.workHistory,
			reviews: json.reviews,
		};

		return freelancer;
	},
	toEntities(json: any): FreelancerDTO[] {
		const freelancers: FreelancerDTO[] = json.map((entity: any) => {
			return {
				freelancerId: entity.freelancerId,
				firstName: entity.firstName,
				lastName: entity.lastName,
				phone: entity.phone,
				email: entity.email,
				userName: entity.userName,
				gender: entity.gender,
				expertise: entity.expertise,
				joinedDate: dayjs(entity.joinedDate).format("YYYY/MM/DD"),
				verified: entity.verified,
				state: entity.state,
			};
		});
		return freelancers;
	},
	toJson(entity: Freelancer): JSON {
		return JSON.parse(JSON.stringify(entity));
	},
};

export { FreelancerMapper };
