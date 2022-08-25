import dayjs from "dayjs";
import { Client } from "../domain/client";
import { ClientDTO } from "../domain/clientRepository";

const ClientMapper = {
    toEntity(json: any): Client {
        const client: Client = {
            clientId: json.clientId,
            firstName: json.firstName,
            lastName: json.lastName,
            userName: json.userName,
            phone: json.phone,
            email: json.email,
            password: json.password,
            completedJobs: json.completedJobs,
            ongoingJobs: json.ongoingJobs,
            cancelledJobs: json.cancelledJobs,
            description: json.description,
            websiteUrl: json.websiteUrl,
            address: json.address === null ? '': json.address,
            socialLinks: json.socialLinks,
            favorites: json.favorites,
            companyName: json.companyName,
            languages: json.languages,
            workCategory: json.workCategory,
            verified: json.verified,
            profilePicture: json.profilePicture,
            rating: json.rating,
            roles: json.roles,
            profileUrl: json.profileUrl,
            spending: json.spending,
            state: json.state,
        };

        return client;
    },
    toEntities(jsons: any): ClientDTO[] {
        console.log(jsons);
        const clients: ClientDTO[] = jsons.map((json: any) => {
            return {
                clientId: json.clientId,
                firstName: json.firstName,
                lastName: json.lastName,
                userName: json.userName,
                phone: json.phone,
                email: json.email,
                createdAt: dayjs(json.createdAt).format("YYYY/MM/DD"),
                verified: json.verified,
                state: json.state,
            };
        });
        return clients;
    },
    toJson(entity: Client): JSON {
        return JSON.parse(JSON.stringify(entity));
    },
};

export { ClientMapper };
