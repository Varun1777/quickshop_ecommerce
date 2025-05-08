
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProductFilters from "./ProductFilters";

// Define the PriceRange type
type PriceRange = {
  min: number;
  max: number;
};

interface MobileFiltersProps {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  filtersApplied: number;
  selectedCategory?: string;
  selectedBrands?: string[];
  setSelectedBrands?: (brands: string[]) => void;
  selectedRating?: number | null;
  setSelectedRating?: (rating: number | null) => void;
  priceRange?: PriceRange;
  setPriceRange?: (range: PriceRange) => void;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  categories,
  brands,
  minPrice,
  maxPrice,
  filtersApplied,
  selectedCategory = "all",
  selectedBrands = [],
  setSelectedBrands = () => {},
  selectedRating = null,
  setSelectedRating = () => {},
  priceRange = { min: minPrice, max: maxPrice },
  setPriceRange = () => {},
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 relative">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {filtersApplied > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-semibold">
              {filtersApplied}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[85vw] sm:max-w-md p-0">
        <ProductFilters
          categories={categories}
          brands={brands}
          minPrice={minPrice}
          maxPrice={maxPrice}
          selectedCategory={selectedCategory}
          selectedBrands={selectedBrands}
          setSelectedBrands={setSelectedBrands}
          selectedRating={selectedRating}
          setSelectedRating={setSelectedRating}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onClose={() => setOpen(false)}
          isMobile={true}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
