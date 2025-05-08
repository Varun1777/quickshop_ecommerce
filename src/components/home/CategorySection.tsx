
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsByCategory, Category } from "../../services/api";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryItemProps {
  category: Category;
  imageUrl: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, imageUrl }) => {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="relative group overflow-hidden rounded-lg"
    >
      <div className="aspect-square">
        <img 
          src={imageUrl} 
          alt={category.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
        <h3 className="text-white font-medium capitalize text-lg">
          {category.name}
        </h3>
      </div>
    </Link>
  );
};

const CategorySection: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryImages = async () => {
      const images: Record<string, string> = {};
      
      try {
        // Fetch products for each category to get thumbnail images
        await Promise.all(
          categories.slice(0, 8).map(async (category) => {
            const data = await getProductsByCategory(category.slug, { limit: 1 });
            if (data.products.length > 0) {
              // Use first product image as category image
              images[category.slug] = data.products[0].thumbnail;
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
          key={category.slug}
          category={category}
          imageUrl={categoryImages[category.slug] || 'https://placehold.co/300x300?text=Category'}
        />
      ))}
    </div>
  );
};

export default CategorySection;
