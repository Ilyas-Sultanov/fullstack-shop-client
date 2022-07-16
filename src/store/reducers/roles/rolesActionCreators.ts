import { AppDispatch } from "../../store";
import { AxiosError } from 'axios';
import { rolesActions } from "./roles";
import RolesService from "../../../services/RolesService";

function getRoles() {
    return async function(dispatch: AppDispatch) {
        try {
            dispatch(rolesActions.setRolesLoading(true));
            const response = await RolesService.getRoles();
            const roles = response.data;
            dispatch(rolesActions.getRolesSuccess(roles));
        }
        catch (err) {
            const e = err as AxiosError;
            dispatch(rolesActions.setRolesError(e.response!.data.message as string));
        }
    }
}

export {
    getRoles
}