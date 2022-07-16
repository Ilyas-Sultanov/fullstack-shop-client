interface IPaginatedData<T> {
    totalNumberOfMatches: number,
    currentPage: number,
    limit: number, 
    link: string,
    data: T[],
}

export default IPaginatedData;