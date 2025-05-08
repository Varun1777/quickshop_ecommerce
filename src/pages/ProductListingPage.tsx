import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts, getCategories, Product, Category } from "../services/api";
import ProductGrid from "../components/products/ProductGrid";
import ProductFilters from "../components/filters/ProductFilters";
import MobileFilters from "../components/filters/MobileFilters";
import SortOptions from "../components/filters/SortOptions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

// Price range type
type PriceRange = {
  min: number;
  max: number;
};

const ProductListingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 2000 });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  
  // Get query parameters
  const categoryParam = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";
  const sortBy = (searchParams.get("sortBy") as 'price' | 'rating') || "price";
  const order = (searchParams.get("order") as 'asc' | 'desc') || "asc";
  const page = parseInt(searchParams.get("page") || "1", 10);
  
  // Use React Query to fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // Cache categories for 1 hour
    refetchOnWindowFocus: false,
  });

  // Fetch products based on filters and sorting
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        const limit = 9;
        const skip = (page - 1) * limit;
        
        const data = await getProducts({
          limit,
          skip,
          category: categoryParam === "all" ? undefined : categoryParam,
          q: searchQuery || undefined,
          sortBy,
          order,
        });
        
        // Apply client-side filters (since DummyJSON API doesn't support these filters)
        let filteredProducts = [...data.products];
        
        // Filter by price
        filteredProducts = filteredProducts.filter(
          (product) => product.price >= priceRange.min && product.price <= priceRange.max
        );
        
        // Filter by brands
        if (selectedBrands.length > 0) {
          filteredProducts = filteredProducts.filter((product) =>
            selectedBrands.includes(product.brand)
          );
        }
        
        // Filter by rating
        if (selectedRating !== null) {
          filteredProducts = filteredProducts.filter(
            (product) => Math.floor(product.rating) >= selectedRating
          );
        }
        
        setProducts(filteredProducts);
        setTotalProducts(data.total);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [categoryParam, searchQuery, sortBy, order, page, priceRange, selectedBrands, selectedRating]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900">
          {searchQuery
            ? `Search Results: "${searchQuery}"`
            : categoryParam !== "all"
            ? `${categoryParam.replace(/-/g, " ").replace(/(^\w|\s\w)/g, m => m.toUpperCase())}`
            : "All Products"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isLoading ? "Loading products..." : `${totalProducts} products found`}
        </p>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
        {/* Sidebar Filters - Desktop */}
        <div className="hidden lg:block lg:col-span-3">
          <ProductFilters
            categories={categories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedCategory={categoryParam}
            selectedBrands={selectedBrands}
            setSelectedBrands={setSelectedBrands}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
            {/* Mobile Filters */}
            <MobileFilters
              categories={categories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedCategory={categoryParam}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
            />

            {/* Sort Options */}
            <div className="ml-auto">
              <SortOptions 
                sortBy={sortBy} 
                order={order}
                onSortChange={(newSortBy, newOrder) => {
                  searchParams.set("sortBy", newSortBy);
                  searchParams.set("order", newOrder);
                  searchParams.set("page", "1");
                  setSearchParams(searchParams);
                }}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-60 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              
              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (page > 1) {
                        searchParams.set("page", (page - 1).toString());
                        setSearchParams(searchParams);
                        window.scrollTo(0, 0);
                      }
                    }}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      searchParams.set("page", (page + 1).toString());
                      setSearchParams(searchParams);
                      window.scrollTo(0, 0);
                    }}
                    disabled={products.length < 9 || totalProducts / 9 <= page}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchParams(new URLSearchParams({ category: "all" }));
                  setPriceRange({ min: 0, max: 2000 });
                  setSelectedBrands([]);
                  setSelectedRating(null);
                }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListingPage;
