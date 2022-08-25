import { Category } from "../domain/category";

const CategoryMapper = {
    toEntity(json: any): Category {
        const category: Category = {
            id: json.id.value,
            categoryName: json.categoryName,
            subCategory: json.subCategory,
            state: json.state,
        };

        return category;
    },

    toEntities(json: []): Category[] {
        return json.map((json) => this.toEntity(json));
    },

    toJson(entity: Category): JSON {
        return JSON.parse(JSON.stringify(entity));
    },
};

export { CategoryMapper };
