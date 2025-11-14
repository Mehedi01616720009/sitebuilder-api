const getPaginate = (query: Record<string, unknown>) => {
    const page = query?.page ? Number(query?.page) : 1;
    const limit = query?.limit ? Number(query?.limit) : 30;
    const skip = (page - 1) * limit;

    return { page, limit, skip };
};

export default getPaginate;
