
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsByCategory } from "../../services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryItemProps {
  name: string;
  imageUrl: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, imageUrl }) => {
  return (
    <Link
      to={`/products?category=${name}`}
      className="relative group overflow-hidden rounded-lg"
    >
      <div className="aspect-square">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
        <h3 className="text-white font-medium capitalize text-lg">
          {name.replace('-', ' ')}
        </h3>
      </div>
    </Link>
  );
};

const CategorySection: React.FC<{ categories: string[] }> = ({ categories }) => {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryImages = async () => {
      const images: Record<string, string> = {};
      
      try {
        // Fetch products for each category to get thumbnail images
        await Promise.all(
          categories.slice(0, 8).map(async (category) => {
            const data = await getProductsByCategory(category, { limit: 1 });
            if (data.products.length > 0) {
              // Use first product image as category image
              images[category] = data.products[0].thumbnail;
            }
          })
        );
        
        setCategoryImages(images);
      } catch (error) {
        console.error("Failed to fetch category images:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categories.length > 0) {
      fetchCategoryImages();
    }
  }, [categories]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {Array(8).fill(0).map((_, index) => (
          <div key={index} className="relative">
            <Skeleton className="aspect-square w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {categories.slice(0, 8).map((category) => (
        <CategoryItem
          key={category}
          name={category}
          imageUrl={categoryImages[category] || 'https://placehold.co/300x300?text=Category'}
        />
      ))}
    </div>
  );
};

export default CategorySection;
