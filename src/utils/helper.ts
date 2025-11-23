export interface PaginationMeta {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    nextPage: number | null;
    previousPage: number | null;
}


export function getPaginationMeta(
    currentPage: number,
    pageSize: number,
    totalItems: number
): PaginationMeta {
    const totalPages = Math.ceil(totalItems / pageSize);
    const nextPage = currentPage < totalPages ? currentPage + 1 : null;
    const previousPage = currentPage > 1 ? currentPage - 1 : null;

    return {
        currentPage,
        pageSize,
        totalItems,
        totalPages,
        nextPage,
        previousPage,
    };
}
