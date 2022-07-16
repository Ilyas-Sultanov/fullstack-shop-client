import IUser from "../IUser";
import IPaginatedData from './IPaginatedData';

interface IUsersData extends IPaginatedData<IUser> {
    data: IUser[]
}

export default IUsersData;