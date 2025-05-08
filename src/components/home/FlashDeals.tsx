
import React, { useEffect, useState } from "react";
import { Product } from "../../services/api";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface FlashDealProps {
  product: Product;
  endTime: Date;
}

const FlashDealItem: React.FC<FlashDealProps> = ({ product, endTime }) => {
  const { addToCart } = useCart();
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  // Format time with leading zeros
  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  // Calculate discount price
  const discountPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <Card className="overflow-hidden h-full">
      <div className="aspect-[4/3] overflow-hidden relative">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute top-0 left-0 bg-red-500 text-white py-1 px-3 text-sm font-bold">
            FLASH DEAL
          </div>
        </Link>
      </div>
      
      <CardContent className="p-4">
  <Link to={`/products/${product.id}`} className="block">
    <h3 className="font-medium text-base mb-1 line-clamp-1 hover:text-brand-600 transition-colors">
      {product.title}
    </h3>
  </Link>

  <div className="flex items-center justify-between mb-2 flex-wrap">
    <div className="flex items-center space-x-2">
      <span className="font-bold text-gray-900 text-sm sm:text-base">${discountPrice.toFixed(2)}</span>
      <span className="text-xs sm:text-sm text-gray-500 line-through">
        ${product.price.toFixed(2)}
      </span>
    </div>
    <span className="bg-red-100 text-red-600 text-xs sm:text-sm font-semibold px-2 py-1 rounded-full mt-1 sm:mt-0">
      -{Math.round(product.discountPercentage)}%
    </span>
  </div>

  <div className="flex items-center mb-3 text-sm text-gray-500">
    <Clock className="h-4 w-4 mr-1" />
    <span className="font-semibold">
      {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
    </span>
  </div>

  <Button 
  className="w-full bg-brand-600 hover:bg-brand-700 text-white text-sm sm:text-base py-2 sm:py-2.5 flex items-center justify-center gap-2"
  onClick={() => addToCart(product)}
  disabled={product.stock === 0}
>
  <ShoppingBag className="h-5 w-5" />
  Add to Cart
</Button>

</CardContent>

    </Card>
  );
};

interface FlashDealsProps {
  products: Product[];
  isLoading?: boolean;
}

const FlashDeals: React.FC<FlashDealsProps> = ({ products, isLoading = false }) => {
  // Create random end times for each product (for demo purposes)
  const createEndTimes = () => {
    return products.map(product => {
      const hours = Math.floor(Math.random() * 24) + 1;
      const now = new Date();
      return new Date(now.getTime() + hours * 60 * 60 * 1000);
    });
  };

  const [endTimes, setEndTimes] = useState<Date[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      setEndTimes(createEndTimes());
    }
  }, [products]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Array(4).fill(0).map((_, index) => (
          <Card key={index}>
            <Skeleton className="aspect-[4/3] w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-1/3 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.slice(0, 4).map((product, index) => (
        <FlashDealItem 
          key={product.id} 
          product={product} 
          endTime={endTimes[index] || new Date(Date.now() + 24 * 60 * 60 * 1000)} 
        />
      ))}
    </div>
  );
};

export default FlashDeals;
