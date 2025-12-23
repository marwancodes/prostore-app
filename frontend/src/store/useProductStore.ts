import {create} from "zustand";
import axios, { AxiosError } from "axios";
import type { Product } from "../types/product";
import toast from "react-hot-toast";


const BASE_URL = "http://localhost:5001";

type ProductStore = {
    products: Product[];
    loading: boolean;
    error: null | string;
    currentProduct: Product | null;
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
    fetchProduct: (id: string | number) => Promise<void>;
    updateProduct: (id: string | number) => Promise<void>;
};


export const useProductStore = create<ProductStore>((set, get) => ({
    products: [],
    loading: false,
    error: null,
    currentProduct: null,


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
    },

    fetchProduct: async (id: string | number) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            set({
                currentProduct: response.data.data,
                formData: response.data.data, // pre-fill form with current product data
                error: null,
            });
        } catch (error) {
            console.error("Failed to fetch product:", error);
            set({ error: "Something went wrong", currentProduct: null });
            toast.error("Failed to fetch product");
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (id: string | number) => {
        set({ loading: true });
        try {
            const { formData } = get();
            const response = await axios.put(`${BASE_URL}/api/products/${id}`, formData);
            set({ currentProduct: response.data.data });
            toast.success("Product updated successfully");
        } catch (error) {
            toast.error("Something went wrong");
            console.log("Error in updateProduct function", error);
        } finally {
            set({ loading: false });
        }
    },

}));