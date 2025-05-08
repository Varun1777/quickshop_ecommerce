
import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Filter, X, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams } from "react-router-dom";

// Define the PriceRange type
type PriceRange = {
  min: number;
  max: number;
};

interface ProductFiltersProps {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  selectedCategory?: string;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedRating: number | null;
  setSelectedRating: (rating: number | null) => void;
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
  onClose?: () => void; // For mobile
  isMobile?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  brands,
  minPrice,
  maxPrice,
  selectedCategory = "all",
  selectedBrands,
  setSelectedBrands,
  selectedRating,
  setSelectedRating,
  priceRange,
  setPriceRange,
  onClose,
  isMobile = false,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleCategoryChange = (category: string) => {
    searchParams.set("category", category);
    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  const handleBrandChange = (brand: string) => {
    const newSelectedBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];
    
    setSelectedBrands(newSelectedBrands);
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange({ min: values[0], max: values[1] });
  };

  const handlePriceApply = () => {
    searchParams.set("minPrice", priceRange.min.toString());
    searchParams.set("maxPrice", priceRange.max.toString());
    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  const handleRatingChange = (rating: number) => {
    if (selectedRating === rating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
    }
  };

  const handleClearAll = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange({ min: minPrice, max: maxPrice });
    setSelectedBrands([]);
    setSelectedRating(null);
    if (onClose) onClose();
  };

  const wrapper = (content: React.ReactNode) => {
    if (isMobile) {
      return (
        <div className="bg-white h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-medium text-lg flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filters
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">{content}</div>
          <div className="border-t p-4">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleClearAll}>
                Clear All
              </Button>
              <Button onClick={onClose}>Apply Filters</Button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lg flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filters
          </h2>
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear All
          </Button>
        </div>
        {content}
      </div>
    );
  };

  const renderFilters = () => (
    <>
      <Accordion type="single" collapsible defaultValue="category">
        {/* Categories */}
        <AccordionItem value="category">
          <AccordionTrigger className="py-3">Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="all-categories" 
                  checked={selectedCategory === "all" || !selectedCategory} 
                  onCheckedChange={() => handleCategoryChange("all")}
                />
                <Label htmlFor="all-categories" className="ml-2 cursor-pointer">
                  All Categories
                </Label>
              </div>
              {categories.slice(0, 10).map((category) => (
                <div key={category} className="flex items-center">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={selectedCategory === category} 
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`category-${category}`} className="ml-2 cursor-pointer capitalize">
                    {category.replace('-', ' ')}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="py-3">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                min={minPrice}
                max={maxPrice}
                step={1}
                value={[priceRange.min, priceRange.max]}
                onValueChange={handlePriceChange}
                className="py-4"
              />
              <div className="flex items-center justify-between">
                <span className="text-sm">${priceRange.min}</span>
                <span className="text-sm">${priceRange.max}</span>
              </div>
              <Button 
                onClick={handlePriceApply} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                Apply Price
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Star Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger className="py-3">Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <Checkbox 
                    id={`rating-${rating}`} 
                    checked={selectedRating === rating} 
                    onCheckedChange={() => handleRatingChange(rating)}
                  />
                  <Label htmlFor={`rating-${rating}`} className="ml-2 flex items-center cursor-pointer">
                    {Array(rating).fill(null).map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                    {Array(5-rating).fill(null).map((_, i) => (
                      <span key={i} className="text-gray-300">★</span>
                    ))}
                    <span className="ml-2">& Up</span>
                  </Label>
                </div>
              ))}
              <div className="flex items-center">
                <Checkbox 
                  id={`rating-0`} 
                  checked={selectedRating === null} 
                  onCheckedChange={() => handleRatingChange(0)}
                />
                <Label htmlFor={`rating-0`} className="ml-2 cursor-pointer">
                  All Ratings
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brand */}
        <AccordionItem value="brand">
          <AccordionTrigger className="py-3">Brand</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="all-brands" 
                  checked={selectedBrands.length === 0} 
                  onCheckedChange={() => setSelectedBrands([])}
                />
                <Label htmlFor="all-brands" className="ml-2 cursor-pointer">
                  All Brands
                </Label>
              </div>
              {brands.map((brand) => (
                <div key={brand} className="flex items-center">
                  <Checkbox 
                    id={`brand-${brand}`} 
                    checked={selectedBrands.includes(brand)} 
                    onCheckedChange={() => handleBrandChange(brand)}
                  />
                  <Label htmlFor={`brand-${brand}`} className="ml-2 cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );

  return wrapper(renderFilters());
};

export default ProductFilters;
