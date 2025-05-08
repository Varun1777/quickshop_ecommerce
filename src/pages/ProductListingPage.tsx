
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories, Product } from "../services/api";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilters from "../components/filters/ProductFilters";
import MobileFilters from "../components/filters/MobileFilters";
import SortOptions from "../components/filters/SortOptions";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const ProductListingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const isMobile = useIsMobile();
  const [searchParams, setSearchParams] = useSearchParams();

  const limit = 12;
  const currentPage = Number(searchParams.get("page")) || 1;
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const sort = searchParams.get("sort") || "";
  const order = searchParams.get("order") || "asc";
  const search = searchParams.get("search") || "";
  const minPriceFilter = Number(searchParams.get("minPrice")) || minPrice;
  const maxPriceFilter = Number(searchParams.get("maxPrice")) || maxPrice;
  const rating = Number(searchParams.get("rating")) || 0;

  // Count active filters
  const filtersApplied = (category ? 1 : 0) + 
                         (brand !== "all" && brand ? 1 : 0) + 
                         (rating > 0 ? 1 : 0) +
                         ((minPriceFilter > minPrice || maxPriceFilter < maxPrice) ? 1 : 0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
    setSearchTerm(search);
  }, [search]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        const options: any = {
          limit,
          skip: (currentPage - 1) * limit,
        };
        
        if (category && category !== "all") {
          options.category = category;
        }
        
        if (search) {
          options.q = search;
        }
        
        if (sort) {
          options.sortBy = sort;
          options.order = order;
        }
        
        const data = await getProducts(options);
        
        // Apply client-side filtering for min/max price and rating
        let filteredProducts = data.products;
        
        if (minPriceFilter > minPrice || maxPriceFilter < maxPrice) {
          filteredProducts = filteredProducts.filter(
            (p) => p.price >= minPriceFilter && p.price <= maxPriceFilter
          );
        }
        
        if (rating > 0) {
          filteredProducts = filteredProducts.filter((p) => p.rating >= rating);
        }
        
        if (brand && brand !== "all") {
          filteredProducts = filteredProducts.filter(
            (p) => p.brand.toLowerCase() === brand.toLowerCase()
          );
        }
        
        setProducts(filteredProducts);
        setTotalProducts(data.total);
        
        // Extract unique brands
        const uniqueBrands = Array.from(new Set(data.products.map((p: Product) => p.brand)));
        setBrands(uniqueBrands);
        
        // Set min and max prices based on products
        if (data.products.length > 0) {
          const prices = data.products.map((p: Product) => p.price);
          setMinPrice(Math.min(...prices));
          setMaxPrice(Math.max(...prices));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage, category, brand, sort, order, search, minPriceFilter, maxPriceFilter, rating]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchParams.set("search", searchTerm.trim());
      searchParams.delete("page");
      setSearchParams(searchParams);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  const handlePageChange = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {category && category !== "all"
          ? `${category.replace('-', ' ')} Products`
          : search
          ? `Search Results for "${search}"`
          : "All Products"}
      </h1>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center mb-8">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5"
                onClick={handleClearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
        <div className="flex gap-2 items-center">
          {isMobile && (
            <MobileFilters
              categories={categories}
              brands={brands}
              minPrice={minPrice}
              maxPrice={maxPrice}
              filtersApplied={filtersApplied}
            />
          )}
          <SortOptions />
        </div>
      </div>
      
      {search && (
        <div className="mb-6">
          <p>
            Showing {products.length} results for 
            <span className="font-semibold"> "{search}"</span>
          </p>
        </div>
      )}
      
      {/* Mobile Active Filters */}
      {filtersApplied > 0 && isMobile && (
        <div className="mb-4 flex flex-wrap gap-2">
          {category && category !== "all" && (
            <div className="bg-gray-100 text-sm rounded-full px-3 py-1 flex items-center">
              <span className="mr-1">Category: {category.replace('-', ' ')}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => {
                  searchParams.delete("category");
                  searchParams.delete("page");
                  setSearchParams(searchParams);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {brand && brand !== "all" && (
            <div className="bg-gray-100 text-sm rounded-full px-3 py-1 flex items-center">
              <span className="mr-1">Brand: {brand}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => {
                  searchParams.delete("brand");
                  searchParams.delete("page");
                  setSearchParams(searchParams);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {rating > 0 && (
            <div className="bg-gray-100 text-sm rounded-full px-3 py-1 flex items-center">
              <span className="mr-1">Rating: {rating}+ stars</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => {
                  searchParams.delete("rating");
                  searchParams.delete("page");
                  setSearchParams(searchParams);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {(minPriceFilter > minPrice || maxPriceFilter < maxPrice) && (
            <div className="bg-gray-100 text-sm rounded-full px-3 py-1 flex items-center">
              <span className="mr-1">
                Price: ${minPriceFilter} - ${maxPriceFilter}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0"
                onClick={() => {
                  searchParams.delete("minPrice");
                  searchParams.delete("maxPrice");
                  searchParams.delete("page");
                  setSearchParams(searchParams);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
      
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        {/* Filters - Desktop */}
        {!isMobile && (
          <div className="hidden md:block sticky top-20 h-fit">
            <ProductFilters
              categories={categories}
              brands={brands}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </div>
        )}
        
        {/* Products */}
        <div className="space-y-6">
          <ProductGrid products={products} isLoading={isLoading} />
          
          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={i}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          )}
          
          {!isLoading && products.length === 0 && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-2">No products found</h2>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button
                onClick={() => {
                  setSearchParams(new URLSearchParams());
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
