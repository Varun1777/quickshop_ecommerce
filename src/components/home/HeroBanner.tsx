import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
const HeroBanner: React.FC = () => {
  return <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-600 text-white">
      {/* Animated background elements */}
      <div className="hidden lg:block absolute -right-40 -top-40 w-96 h-96 rounded-full bg-white opacity-10"></div>
      <div className="hidden lg:block absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-white opacity-10"></div>
      <div className="hidden lg:block absolute -left-20 top-1/2 w-64 h-64 rounded-full bg-white opacity-10 transform -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <div className="inline-block bg-yellow-500 text-black px-3 py-1 rounded-full mb-4 animate-pulse">
              Limited Time Offer!
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-4">
              Mega Sale <br />
              <span className="inline-block bg-white text-blue-600 px-3 py-1 mt-2 rounded-sm">Up to 70% OFF</span>
            </h1>
            <p className="text-lg md:text-xl mb-6 max-w-xl opacity-90">
              Shop the season's most popular items at unbeatable prices. 
              Free shipping on orders over $50!
            </p>
            
            {/* Shopping tips */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                <p className="text-sm opacity-90">Daily deals refresh every 24 hours</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-yellow-400"></div>
                <p className="text-sm opacity-90">Free returns on all purchases</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400 font-bold flex items-center gap-2" asChild>
                <Link to="/products"><ShoppingCart className="h-5 w-5" /> Shop Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 flex items-center gap-2" asChild>
                <Link to="/products">View Categories <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center md:justify-end relative">
            <div className="relative">
              {/* Main product image */}
              <div className="bg-white/20 backdrop-filter backdrop-blur-sm p-4 md:p-8 rounded-full mx-[29px] my-[7px] py-[12px] px-[10px]">
                <img alt="Featured Product" src="/lovable-uploads/f67420e0-418d-49b8-af76-cd3b59d85a00.jpg" className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover" />
              </div>
              
              {/* Product badges */}
              <div className="absolute -top-4 -right-4 bg-red-500 text-white font-bold rounded-full transform rotate-12 shadow-lg px-[8px] py-[7px] mx-[95px] my-[72px]">
                70% OFF
              </div>
              
              <div className="absolute -bottom-2 -left-2 md:bottom-0 md:left-0 bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full animate-pulse shadow-lg my-[240px] mx-0">
                Best Seller!
              </div>
              
              {/* Timer */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 font-bold px-4 py-2 rounded-md shadow-lg flex items-center space-x-1 mx-0 my-0">
                <span className="text-sm">Ends in:</span>
                <div className="bg-gray-200 px-2 py-1 rounded">23</div>
                <span>:</span>
                <div className="bg-gray-200 px-2 py-1 rounded">59</div>
                <span>:</span>
                <div className="bg-gray-200 px-2 py-1 rounded">59</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroBanner;