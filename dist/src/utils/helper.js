"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationMeta = getPaginationMeta;
function getPaginationMeta(currentPage, pageSize, totalItems) {
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
