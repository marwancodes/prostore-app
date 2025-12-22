import {create} from "zustand";
import axios, { AxiosError } from "axios";
import type { Product } from "../types/product";
import toast from "react-hot-toast";


const BASE_URL = "http://localhost:5001";

type ProductStore = {
    products: Product[];
    loading: boolean;
    error: null | string;
    fetchProducts: () => Promise<void>;
    deleteProduct: (id: string | number) => Promise<void>;
    // form state
    formData: {
        name: string;
        price: string;
        image: string;
    };
    setFormData: (formData: { name: string; price: string; image: string }) => void;
    resetFormData: () => void;
    addProduct: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
};


export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    loading: false,
    error: null,

    // form state
    formData: {
        name: "",
        price: "",
        image: "",
    },

    setFormData: (formData) => set({ formData }),
    resetFormData: () => set({ formData: { name: "", price: "", image: "" } }),

    addProduct: async (e) => {
        e.preventDefault();
        set({ loading: true });
        try {
            const {formData} = get();
            await axios.post(`${BASE_URL}/api/products`, formData);
            await get().fetchProducts();
            get().resetFormData();
            toast.success("Product added successfully");
            //TODO: close modal
            (document.getElementById("add_product_modal") as HTMLDialogElement).close();
        } catch (error) {
            console.error("Failed to add product:", error);
            toast.error("Failed to add product");
        }
    },

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
    
    },

    deleteProduct: async (id: string | number) => {
        set({ loading: true });
        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`);
            set(prev => ({
                products: prev.products.filter((product) => product.id !== id),
            }));
            toast.success("Product deleted successfully");
        } catch (error) {
            console.error("Failed to delete product:", error);
            toast.error("Failed to delete product");
        } finally {
            set({ loading: false });
        }
    }

}));