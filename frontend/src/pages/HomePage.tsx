import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/product";



const HomePage = () => {

  const {products, loading, error, fetchProducts} = useProductStore();


  useEffect(() => {
    fetchProducts();
  },[fetchProducts])

  console.log("Products:", products, loading, error);

  return (
    <main className="max-w-6xl px-4 py-8 mx-auto ">

      <div className="flex items-center justify-between mb-8">
        <button
          className="btn btn-primary">
          <PlusCircleIcon className="mr-2 size-5" />
          Add Product
        </button>

        <button className="btn btn-ghost btn-circle" onClick={fetchProducts}>
          <RefreshCwIcon className="size-5" />
        </button>
      </div>

      {error && (<div className="mb-8 alert alert-error">{error}</div>)}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="loading loading-spinner loading-lg"/>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>)}

    </main>
  )
}

export default HomePage