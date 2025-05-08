
import React, { useState, useEffect, useRef } from "react";
import { Product } from "../../services/api";
import ProductCard from "../products/ProductCard";
import ProductQuickView from "../products/ProductQuickView";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FeaturedProductsCarouselProps {
  products: Product[];
  isLoading?: boolean;
  title: string;
  subtitle?: string;
}

const FeaturedProductsCarousel: React.FC<FeaturedProductsCarouselProps> = ({
  products,
  isLoading = false,
  title,
  subtitle,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Check if scroll buttons should be visible
  useEffect(() => {
    const checkScroll = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth - 10);
      }
    };

    checkScroll();
    window.addEventListener("resize", checkScroll);
    
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      const newScrollLeft =
        direction === "left"
          ? carouselRef.current.scrollLeft - scrollAmount
          : carouselRef.current.scrollLeft + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
      
      // Update button visibility after scroll animation
      setTimeout(() => {
        if (carouselRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          setShowLeftButton(scrollLeft > 0);
          setShowRightButton(scrollLeft + clientWidth < scrollWidth - 10);
        }
      }, 300);
    }
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  const renderSkeletons = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="min-w-[280px] bg-white rounded-lg overflow-hidden shadow p-4">
          <Skeleton className="aspect-square w-full mb-4" />
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-4 w-1/3 mb-4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ));
  };

  return (
    <div className="relative">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={!showLeftButton}
            className={!showLeftButton ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            disabled={!showRightButton}
            className={!showRightButton ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div
        ref={carouselRef}
        className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar"
        onScroll={() => {
          if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setShowLeftButton(scrollLeft > 0);
            setShowRightButton(scrollLeft + clientWidth < scrollWidth - 10);
          }
        }}
      >
        {isLoading
          ? renderSkeletons()
          : products.map((product) => (
              <div key={product.id} className="min-w-[280px] max-w-[280px]">
                <ProductCard
                  product={product}
                  onQuickView={() => handleQuickView(product)}
                />
              </div>
            ))}
      </div>

      {/* Small screen scroll buttons */}
      <div className="flex md:hidden items-center justify-center mt-4 space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("left")}
          disabled={!showLeftButton}
          className={!showLeftButton ? "opacity-50 cursor-not-allowed" : ""}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scroll("right")}
          disabled={!showRightButton}
          className={!showRightButton ? "opacity-50 cursor-not-allowed" : ""}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {quickViewProduct && (
        <ProductQuickView product={quickViewProduct} onClose={closeQuickView} />
      )}
    </div>
  );
};

export default FeaturedProductsCarousel;
