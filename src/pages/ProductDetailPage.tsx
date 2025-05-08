
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProduct, Product, getProducts } from "../services/api";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ChevronRight, Minus, Plus, ShoppingBag, Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import FeaturedProductsCarousel from "../components/home/FeaturedProductsCarousel";

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      try {
        setIsLoading(true);
        const data = await getProduct(Number(productId));
        setProduct(data);
        setSelectedImage(data.thumbnail);
        
        // Fetch related products in the same category
        const relatedData = await getProducts({ 
          category: data.category,
          limit: 10
        });
        
        setRelatedProducts(
          relatedData.products.filter(p => p.id !== data.id).slice(0, 8)
        );
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/products");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, navigate]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-4">
          <Link to="/products" className="text-brand-600 hover:underline">
            Browse all products
          </Link>
        </p>
      </div>
    );
  }

  // Calculate discount price
  const discountPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm mb-6">
        <Link to="/" className="text-gray-500 hover:text-brand-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link to="/products" className="text-gray-500 hover:text-brand-600 transition-colors">
          Products
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <Link 
          to={`/products?category=${product.category}`} 
          className="text-gray-500 hover:text-brand-600 transition-colors capitalize"
        >
          {product.category.replace('-', ' ')}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
        <span className="text-gray-800 font-medium truncate">{product.title}</span>
      </nav>
      
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div>
          <div className="aspect-square rounded-lg overflow-hidden mb-4 border">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[product.thumbnail, ...product.images.slice(0, 4)].map((image, index) => (
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
        <div>
          <span className="text-sm font-medium text-brand-600 capitalize">
            {product.category.replace('-', ' ')}
          </span>
          <h1 className="text-3xl font-bold mt-1 mb-2">{product.title}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 fill-current text-yellow-400" />
              <span className="ml-1 font-medium">{product.rating.toFixed(1)}</span>
            </div>
            <span className="mx-3 text-gray-300">|</span>
            <span className="text-gray-600">Brand: {product.brand}</span>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="text-3xl font-bold text-gray-900">
                ${discountPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="ml-3 text-gray-500 line-through text-lg">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-3 bg-red-100 text-red-600 text-sm font-semibold px-2 py-1 rounded">
                    Save {Math.round(product.discountPercentage)}%
                  </span>
                </>
              )}
            </div>
            
            <div className="flex items-center">
              <div className={product.stock > 10 ? "text-green-600" : (product.stock > 0 ? "text-amber-500" : "text-red-600")}>
                {product.stock > 10
                  ? "In Stock"
                  : product.stock > 0
                  ? `Low Stock: ${product.stock} left`
                  : "Out of Stock"}
              </div>
            </div>
          </div>
          
          <p className="text-gray-700 mb-6">
            {product.description}
          </p>
          
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
              <span className="ml-4 text-sm text-gray-500">
                {product.stock} available
              </span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              className="flex-1 bg-brand-600 hover:bg-brand-700"
              size="lg"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg" className="flex-1">
              <Heart className="h-5 w-5 mr-2" />
              Add to Wishlist
            </Button>
          </div>
          
          {/* Product Meta Info */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">SKU:</span>
                <span className="ml-2 text-sm font-medium">PROD-{product.id}</span>
              </div>
              <div>
                <span className="text-sm text-gray-500">Category:</span>
                <Link 
                  to={`/products?category=${product.category}`}
                  className="ml-2 text-sm font-medium text-brand-600 hover:underline capitalize"
                >
                  {product.category.replace('-', ' ')}
                </Link>
              </div>
              <div>
                <span className="text-sm text-gray-500">Brand:</span>
                <Link 
                  to={`/products?brand=${product.brand}`}
                  className="ml-2 text-sm font-medium text-brand-600 hover:underline"
                >
                  {product.brand}
                </Link>
              </div>
              <div>
                <span className="text-sm text-gray-500">Tags:</span>
                <span className="ml-2 text-sm font-medium">{product.category}, {product.brand}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mb-16">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b rounded-none">
            <TabsTrigger value="description" className="rounded-b-none">Description</TabsTrigger>
            <TabsTrigger value="specifications" className="rounded-b-none">Specifications</TabsTrigger>
            <TabsTrigger value="reviews" className="rounded-b-none">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-4">
            <div className="max-w-3xl">
              <h3 className="text-lg font-medium mb-3">Product Description</h3>
              <p className="text-gray-700 mb-4">{product.description}</p>
              <p className="text-gray-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus hendrerit suscipit
                egestas. Nunc eget congue ante. Vivamus ut sapien et ex volutpat tincidunt eget at
                felis. Sed consectetur non diam sed faucibus. Phasellus sollicitudin vitae nunc non
                tempus.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-4">
            <div className="max-w-3xl">
              <h3 className="text-lg font-medium mb-3">Product Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="font-medium">{product.brand}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium capitalize">{product.category.replace('-', ' ')}</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Rating</p>
                  <p className="font-medium">{product.rating} out of 5</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="font-medium">{product.stock} units</p>
                </div>
                <div className="border-b pb-2">
                  <p className="text-sm text-gray-500">Item ID</p>
                  <p className="font-medium">PROD-{product.id}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="py-4">
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium">Customer Reviews</h3>
                <Button>Write a Review</Button>
              </div>
              <div className="flex items-center mb-6">
                <div className="flex items-center">
                  {Array(5).fill(null).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-6 w-6 ${
                        i < Math.floor(product.rating) 
                          ? "fill-current text-yellow-400" 
                          : "text-gray-300"
                      }`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-lg font-bold">{product.rating.toFixed(1)} out of 5</span>
              </div>
              <p className="text-gray-700">
                No reviews yet. Be the first to write a review!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <FeaturedProductsCarousel
            products={relatedProducts}
            title="You May Also Like"
            subtitle="Related products you might be interested in"
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
