
import React, { useEffect, useState } from "react";
import { Product } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductQuickViewProps {
  product: Product;
  onClose: () => void;
}

const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.thumbnail);
  const { addToCart } = useCart();

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setSelectedImage(product.thumbnail);
  }, [product]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    onClose();
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Calculate discount price
  const discountPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden">
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Images */}
          <div className="p-6">
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${
                    selectedImage === image ? "border-brand-600" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 flex flex-col">
            <div className="mb-2 flex items-center">
              <span className="text-sm font-medium text-brand-600 capitalize">
                {product.category}
              </span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">{product.brand}</span>
            </div>

            <DialogTitle className="text-xl font-bold mb-2">{product.title}</DialogTitle>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{product.rating.toFixed(1)}</span>
              </div>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            <p className="text-gray-600 mb-6 flex-grow">{product.description}</p>

            <div className="mb-4">
              <div className="flex items-center mb-2">
                <span className="text-2xl font-bold text-gray-900">
                  ${discountPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="ml-2 text-gray-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="ml-2 bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded">
                      Save {Math.round(product.discountPercentage)}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-4 text-center w-8">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                className="flex-1 bg-brand-600 hover:bg-brand-700"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/products/${product.id}`} onClick={onClose}>
                  View Full Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
