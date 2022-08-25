type ResultPage = {
    current: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
    first: boolean;
    last: boolean;
};

type QueryResult<T> = Readonly<{
    data: T;
}>;

type PaginatedQueryResult<T> = QueryResult<T> & {
    page: ResultPage;
};

export { ResultPage, PaginatedQueryResult };
