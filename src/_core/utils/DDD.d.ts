export type DataMapper<E, D> = {
    toDomainEntity(ormEntity: D): E;
    toJson(domainEntity: E): D;
};

type ResultPage = Readonly<{
    current: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
}>;

type QueryResult<T> = Readonly<{
    data: T;
}>;

type PaginatedQueryResult<T> = QueryResult<T> &
    Readonly<{
        page: ResultPage;
    }>;

export { ResultPage, QueryResult, PaginatedQueryResult };
