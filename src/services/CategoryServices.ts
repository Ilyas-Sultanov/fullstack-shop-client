import { IResponseCategory } from '../types/CategoryTypes';
import api from "../http";
import {AxiosResponse} from "axios";

class CategoryServices {
    static async create(formData: FormData): Promise<AxiosResponse> {
        const result = await api.post(
            '/categories', 
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return result;
    }

    static async getAll(): Promise<AxiosResponse<IResponseCategory[]>>  {
        const result = await api.get('/categories');
        return result;
    }

    static async getOne(_id: string): Promise<AxiosResponse<IResponseCategory>>  {
        const result = await api.get(`/categories/${_id}`);
        return result;
    }

    static async edit(categoryId: string, formData: FormData): Promise<AxiosResponse> {
        const result = await api.put(
            `/categories/${categoryId}`, 
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return result;
    }

    static async delete(_id: string): Promise<AxiosResponse> {
        const result = await api.delete(`/categories/${_id}`);
        return result;
    }
}

export default CategoryServices;