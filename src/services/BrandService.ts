import api from "../http";
import {AxiosResponse} from "axios";
import {DBBrand} from '../types/Brand';

class BrandService {
    static async create(name: string): Promise<AxiosResponse> {
        return await api.post('/brand', {name});
    }

    static async getAll(): Promise<AxiosResponse<Array<DBBrand>>> {
        return await api.get('/brand');
    }

    static async edit(_id: string, name: string): Promise<AxiosResponse> {
        return await api.put(`/brand/${_id}`, {name});
    }

    static async delete(_id: string): Promise<AxiosResponse> {
        return await api.delete(`/brand/${_id}`);
    }
}

export default BrandService;