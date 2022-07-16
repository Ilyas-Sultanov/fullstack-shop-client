import api from "../http";
import {AxiosResponse} from "axios";
import {IProductsData, IDBProduct} from "../types/Products";

class ProductsService {
    static async createProduct(formData: FormData): Promise<AxiosResponse> {
        return api.post(
            `/products`, 
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
    }


    static async getManyProducts(searchParams?: URLSearchParams): Promise<AxiosResponse<IProductsData>> {
        const str = searchParams ? `/products?${searchParams}` : '/products';
        return api.get<IProductsData>(str);
    }


    static async getOne(productId: string): Promise<AxiosResponse<IDBProduct>> {
        return api.get<IDBProduct>(`/products/${productId}`);
    }


    static async editProduct(formData: FormData): Promise<AxiosResponse> {
        return api.put(
            `/products`,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
    }

    static async deleteOneProduct(_id: string): Promise<AxiosResponse> {
        const result = await api.delete(`/products/${_id}`);
        return result;
    }

    static async getHighestPrice(): Promise<AxiosResponse<number>> {
        const result = await api.get<number>('/products/highestPrice');
        return result
    }
}

export default ProductsService;