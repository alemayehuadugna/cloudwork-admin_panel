import { Feedback } from "../domain/feedback";

const FeedbackMapper = {
    toEntity(json: any): Feedback {
        const feedback : Feedback = {
            id: json.id.value,
            firstName: json.firstName,
            lastName: json.lastName,
            message: json.message,
            title: json.title,
            state: json.state
        };

        return feedback;
    },

    toEntities(jsons: []): Feedback[] {
        return jsons.map(json => this.toEntity(json));
    },

    toJson(entity: Feedback): JSON {
        return JSON.parse(JSON.stringify(entity));
    },

};

export { FeedbackMapper };
