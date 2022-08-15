import api from "../http";
import {AxiosResponse} from "axios";
import {IProductsData, IPreparedForUIProduct} from "../types/Products";

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


    static async getOne(productId: string): Promise<AxiosResponse<IPreparedForUIProduct>> {
        return api.get<IPreparedForUIProduct>(`/products/${productId}`);
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

    static async getHighestPrice(categoryId?: string): Promise<AxiosResponse<number>> {
        /**
         * Получаем значение для параметра max у RangeSlider.
         * Если categoryId передано то это вызов из публичной страницы products, 
         * и самая высокая цена нужна для товаров определённой категории.
         * Если categoryId не передано, то это вызов из админки,
         * и самая высокая цена среди всех товаров.
         */
        let reqStr = '/products/highestPrice';
        if (categoryId) reqStr = reqStr + `?categoryId=${categoryId}`;
        const result = await api.get<number>(reqStr);
        return result
    }
}

export default ProductsService;