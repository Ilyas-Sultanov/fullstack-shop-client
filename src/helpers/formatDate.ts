function formatDate(validStr: string) {
    const day = validStr.substring(8, 10);
    const month = validStr.substring(5, 7);
    const year = validStr.substring(0, 4);
    return `${day}.${month}.${year}`;
}

export default formatDate;