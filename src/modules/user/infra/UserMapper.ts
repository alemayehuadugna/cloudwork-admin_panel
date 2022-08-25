import { User } from "../domain/user";

const UserMapper = {
    toEntity(json: any): User {
        const user = {
            uid: json.id.value,
            firstName: json.firstName,
            lastName: json.lastName,
            phone: json.phone,
            email: json.email,
            gender: json.gender,
            profilePicture: json.profilePicture,
            roles: json.roles,
        };
        return user;
    },
    toJson(entity: User): JSON {
        return JSON.parse(JSON.stringify(entity));
    },
};

export { UserMapper };
