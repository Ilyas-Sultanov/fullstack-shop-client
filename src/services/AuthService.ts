import api from "../http";
import {AxiosResponse} from "axios";
import AuthResponse from "../types/response/AuthResponse";

class AuthService {
    // constructor() {}
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>('/auth/login', {email, password});
    }

    static async registration(name: string, email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return api.post<AuthResponse>('/auth/registration', {name, email, password});
    }

    static async logout(): Promise<void> {
        return api.get('/auth/logout');
    } 

    static async forgotPassword(email: string) {
        return api.post('/auth/forgotPassword', {email});
    }

    static async resetPassword(resetLink: string, newPassword: string) {
        return api.patch('/auth/resetPassword', {resetLink, newPassword});
    }
}

export default AuthService;