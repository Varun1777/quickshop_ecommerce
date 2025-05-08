
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import ProductFilters from "./ProductFilters";

interface MobileFiltersProps {
  categories: string[];
  brands: string[];
  minPrice: number;
  maxPrice: number;
  filtersApplied: number;
}

const MobileFilters: React.FC<MobileFiltersProps> = ({
  categories,
  brands,
  minPrice,
  maxPrice,
  filtersApplied,
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
          onClose={() => setOpen(false)}
          isMobile={true}
        />
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
