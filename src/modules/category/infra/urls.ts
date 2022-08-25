export function urlGenerator(props?: any) {
    let url = "/categories";
    if (props.filter || props.pagination) {
        url = "/categories?";
        let count = 0;
        if (props.filter) {
            Object.entries(props.filter).forEach(([key, value]) => {
                if (value) {
                    if (!count) {
                        url = url + `filter[${key}]=${value}`;
                    } else {
                        url = url + `&filter[${key}]=${value}`;
                    }

                    count++;
                }
            });
        }
        if (props.pagination) {
            if (count) {
                url = url + `&page=${props.pagination.page}&limit=${props.pagination.pageSize}`;
            } else {
                url = url + `page=${props.pagination.page}&limit=${props.pagination.pageSize}`;
            }
        }
    }
    return url;
}
