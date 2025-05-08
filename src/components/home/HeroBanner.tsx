
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-brand-700 to-brand-600 text-white">
      {/* Decorative elements */}
      <div className="hidden lg:block absolute -right-40 -top-40 w-96 h-96 rounded-full bg-white opacity-10"></div>
      <div className="hidden lg:block absolute -right-20 -bottom-20 w-72 h-72 rounded-full bg-white opacity-10"></div>
      <div className="hidden lg:block absolute -left-20 top-1/2 w-64 h-64 rounded-full bg-white opacity-10 transform -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-4">
              Summer Sale <br />
              <span className="inline-block bg-white text-brand-600 px-3 py-1 mt-2">Up to 50% OFF</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-xl opacity-90">
              Discover amazing deals on trending products across all categories. 
              Limited time offer!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button 
                size="lg"
                className="bg-white text-brand-600 hover:bg-gray-100 hover:text-brand-700"
                asChild
              >
                <Link to="/products">Shop Now</Link>
              </Button>
              <Button 
                size="lg"
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-brand-600"
                asChild
              >
                <Link to="/products">Explore Categories</Link>
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center md:justify-end relative">
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-full p-4 md:p-8">
              <img 
                src="https://dummyjson.com/image/i/products/1/1.jpg" 
                alt="Featured Product" 
                className="w-64 h-64 md:w-80 md:h-80 object-contain rounded-full"
              />
            </div>
            {/* Floating tag */}
            <div className="absolute -bottom-4 md:right-0 md:-bottom-4 bg-yellow-400 text-gray-900 font-bold px-4 py-2 rounded-full animate-pulse">
              Limited Time!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
