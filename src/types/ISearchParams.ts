import { RoleType } from "./RoleTypes";

interface ISearchParams extends Record<string, string | string[]> {
    page: string,
    limit: string,
    sort: string,
    order: string,
}

export interface IUsersSearchParams extends ISearchParams {
    _id: string,
    name: string,
    email: string,
    // roles: '' | IRole[],
    roles: string[],
    isActivated: '' |'true' | 'false',
    dateFrom: string,
    dateTo: string,
}

