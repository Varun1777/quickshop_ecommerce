
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { Star, ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  onQuickView?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart } = useCart();
  
  // Calculate discount price
  const discountPrice = product.price * (1 - product.discountPercentage / 100);
  
  // Format price with 2 decimal places
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow hover:shadow-md">
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover transform transition duration-300 hover:scale-105"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round(product.discountPercentage)}% OFF
          </span>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </Link>
      
      <div className="p-4">
        <div className="flex items-center mb-1">
          <span className="text-sm text-gray-500">{product.brand}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500 capitalize">{product.category}</span>
        </div>
        
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 hover:text-brand-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center text-amber-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
          {product.stock > 0 ? (
            <span className="ml-auto text-xs text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="ml-auto text-xs text-red-600 font-medium">Out of Stock</span>
          )}
        </div>
        
        <div className="flex items-center mb-3">
          <span className="font-bold text-lg text-gray-900">
            {formatPrice(discountPrice)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 bg-brand-600 hover:bg-brand-700" 
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            <span>{product.stock > 0 ? "Add to Cart" : "Sold Out"}</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="px-2" 
            onClick={onQuickView}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
