
import React, { useEffect, useState } from "react";
import HeroBanner from "../components/home/HeroBanner";
import CategorySection from "../components/home/CategorySection";
import FeaturedProductsCarousel from "../components/home/FeaturedProductsCarousel";
import FlashDeals from "../components/home/FlashDeals";
import { getProducts, getCategories, Product, Category } from "../services/api";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use React Query to fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // Cache categories for 1 hour
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products with high ratings for featured section
        const featuredData = await getProducts({ limit: 15 });
        setFeaturedProducts(
          featuredData.products
            .filter((product) => product.rating >= 4.5)
            .slice(0, 10)
        );
        
        // Get products with highest discount for flash deals
        const dealsData = await getProducts({ limit: 20 });
        setFlashDeals(
          dealsData.products
            .sort((a, b) => b.discountPercentage - a.discountPercentage)
            .slice(0, 4)
        );
        
        // Get random products for new arrivals (just for demo purposes)
        // In a real application, you would filter by date
        const shuffled = [...dealsData.products].sort(() => 0.5 - Math.random());
        setNewArrivals(shuffled.slice(0, 10));
      } catch (error) {
        console.error("Error fetching home page data:", error);
        toast.error("Failed to load page data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  return (
    <div>
      <HeroBanner />
      
      <div className="container mx-auto px-4 py-12 space-y-16">
        {/* Categories Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-900">Shop by Category</h2>
            <p className="text-gray-600 mt-1">Explore our wide range of product categories</p>
          </div>
          <CategorySection categories={categories} />
        </section>
        
        {/* Featured Products */}
        <section>
          <FeaturedProductsCarousel
            products={featuredProducts}
            isLoading={isLoading}
            title="Featured Products"
            subtitle="Top picks based on customer ratings and feedback"
          />
        </section>
        
        {/* Flash Deals Section */}
        <section className="bg-gray-50 py-10 -mx-4 px-4">
          <div className="container mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl font-heading font-bold text-gray-900 flex items-center">
                <span className="mr-2 text-red-500">⚡</span> 
                Flash Deals
              </h2>
              <p className="text-gray-600 mt-1">Limited-time offers at incredible prices</p>
            </div>
            <FlashDeals products={flashDeals} isLoading={isLoading} />
          </div>
        </section>
        
        {/* New Arrivals */}
        <section>
          <FeaturedProductsCarousel
            products={newArrivals}
            isLoading={isLoading}
            title="New Arrivals"
            subtitle="Check out our latest products"
          />
        </section>
        
        {/* Newsletter */}
        <section className="bg-brand-50 py-12 -mx-4 px-4 rounded-lg">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-heading font-bold mb-3">Join Our Newsletter</h2>
            <p className="mb-6 text-gray-600">Subscribe to get special offers, free giveaways, and product announcements.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
