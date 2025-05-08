
import React from "react";
import { Product } from "../../services/api";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading }) => {
  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const renderSkeletons = () => {
    return Array(8)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="bg-white rounded-lg overflow-hidden shadow p-4">
          <Skeleton className="aspect-square w-full mb-4" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-1/3 mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ));
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading
          ? renderSkeletons()
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={() => handleQuickView(product)}
              />
            ))}
      </div>

      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} onClose={closeQuickView} />
      )}
    </div>
  );
};

export default ProductGrid;
