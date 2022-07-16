import api from "../http";
import {AxiosResponse} from "axios";
import IUsersData from "../types/response/IUsersData";
import { IEditingUser } from '../store/reducers/users/users';

class UserService {
    // constructor() {}
    static async getManyUsers(searchParams?: URLSearchParams): Promise<AxiosResponse<IUsersData>> {
        const str = searchParams ? `/users?${searchParams}` : '/users';
        return api.get<IUsersData>(str);
    }

    static async getOneUser(_id: string): Promise<AxiosResponse<IEditingUser>> {
        return api.get<IEditingUser>(`/users/${_id}`);
    }

    static async editUser(editedUser: IEditingUser): Promise<AxiosResponse> {
        return api.patch(`/users/${editedUser._id}`, editedUser);
    }

    static async deleteOneUser(_id: string): Promise<AxiosResponse> {
        const result = await api.delete(`/users/${_id}`);
        return result;
    }
}

export default UserService;