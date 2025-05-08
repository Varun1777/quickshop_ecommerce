
import React from "react";
import { Product } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

interface CartItemProps {
  item: {
    product: Product;
    quantity: number;
  };
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { product, quantity } = item;
  const { removeFromCart, updateQuantity } = useCart();

  const handleRemove = () => {
    removeFromCart(product.id);
  };

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(product.id, newQuantity);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      handleQuantityChange(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(quantity - 1);
    }
  };

  // Calculate discount price
  const discountPrice = product.price * (1 - product.discountPercentage / 100);
  const totalPrice = discountPrice * quantity;

  return (
    <div className="flex py-6 border-b">
      {/* Product image */}
      <div className="flex-shrink-0 w-24 h-24 border rounded-md overflow-hidden">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>

      {/* Product details */}
      <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:justify-between">
        <div className="flex-1">
          <Link to={`/products/${product.id}`} className="focus:outline-none">
            <h3 className="text-base font-medium text-gray-900 hover:text-brand-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          <p className="mt-1 text-sm text-gray-500">
            {product.brand} • {product.category}
          </p>
          
          <div className="mt-1 text-sm text-gray-500">
            {product.discountPercentage > 0 ? (
              <div className="flex items-center">
                <span className="text-base font-medium text-gray-900">
                  ${discountPrice.toFixed(2)}
                </span>
                <span className="ml-2 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-2 bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded">
                  {Math.round(product.discountPercentage)}% OFF
                </span>
              </div>
            ) : (
              <span className="text-base font-medium text-gray-900">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Quantity and price */}
        <div className="flex flex-col justify-between mt-4 sm:mt-0">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="mx-2 text-center w-8">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center justify-between sm:flex-col sm:items-end mt-4 sm:mt-0">
            <span className="text-base font-medium text-gray-900">
              ${totalPrice.toFixed(2)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0 h-8 mt-2"
              onClick={handleRemove}
            >
              <Trash className="h-4 w-4 mr-1" />
              <span className="text-xs">Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
