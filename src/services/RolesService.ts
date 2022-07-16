import api from "../http";
import {IRoleDataItem} from "../types/RoleTypes";

class RolesService {
    static async getRoles() {
        const roles = await api.get<IRoleDataItem[]>('/roles');
        return roles;
    }
}

export default RolesService;