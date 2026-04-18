type iOption = {
    sortBy?: string;
    sortOrder?: string;
    page?: number | string;
    limit?: number | string;
}

type ioptionResult ={
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
}

function sortingPagination(option: iOption): ioptionResult {
    console.log("sorting query", option);
    const page = Number(option.page) || 1;
    const limit = Number(option.limit) || 3;

    const sortBy = option.sortBy || 'createdAt';
    const sortOrder = option.sortOrder || 'desc';

    const skip = (page - 1) * limit;

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    };
}


export const paginationHelper = {
    sortingPagination
};