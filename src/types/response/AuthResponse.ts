import IUser from '../IUser';

interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}

export default AuthResponse;