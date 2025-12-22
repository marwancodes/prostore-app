import {create} from "zustand";
import axios, { AxiosError } from "axios";


const BASE_URL = "http://localhost:5001";

type ProductStore = {
    products: unknown[];
    loading: boolean;
    error: null | string;
    fetchProducts: () => Promise<void>;
};


export const useProductStore = create<ProductStore>((set) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/products`);
            // const data = await response.json();
            set({ products: response.data.data , error: null });
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                const status = err.response?.status;

            if (status === 429) {
                set({ error: "Rate limit exceeded", products: [] });
            } else {
                set({ error: "Something went wrong", products: [] });
            }
            } else {
                set({ error: "Something went wrong", products: [] });
            }
    } finally {
        set({ loading: false });
    } 
    
},}))