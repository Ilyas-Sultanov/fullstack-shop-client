import api from "../http";
import {AxiosResponse} from "axios";
import { INewOrder } from "../types/Order";

class OrderService {
    static async createOrder(newOrder: INewOrder): Promise<AxiosResponse> {
        return api.post(`/orders`, newOrder);
    }
}

export default OrderService;