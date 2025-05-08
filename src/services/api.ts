
import { toast } from "sonner";

const BASE_URL = "https://dummyjson.com";

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

// Helper to handle API errors
const handleApiError = (error: unknown): never => {
  console.error("API Error:", error);
  toast.error("Failed to fetch data. Please try again.");
  throw error;
};

// Fetch all products with pagination and filtering
export const getProducts = async (
  options: {
    limit?: number;
    skip?: number;
    category?: string;
    q?: string;
    sortBy?: 'price' | 'rating';
    order?: 'asc' | 'desc';
  } = {}
): Promise<ProductsResponse> => {
  const { limit = 10, skip = 0, category, q, sortBy, order } = options;
  
  try {
    let url = `${BASE_URL}/products`;
    
    // Apply category filter
    if (category && category !== 'all') {
      url = `${BASE_URL}/products/category/${category}`;
    }
    
    // Apply search query
    if (q) {
      url = `${BASE_URL}/products/search?q=${encodeURIComponent(q)}`;
    }
    
    url += url.includes('?') ? '&' : '?';
    url += `limit=${limit}&skip=${skip}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    let data = await response.json() as ProductsResponse;
    
    // Apply sorting (client-side since DummyJSON doesn't support it)
    if (sortBy) {
      data.products = data.products.sort((a, b) => {
        const valueA = a[sortBy];
        const valueB = b[sortBy];
        
        if (order === 'desc') {
          return valueB - valueA;
        }
        return valueA - valueB;
      });
    }
    
    return data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch a single product by ID
export const getProduct = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json() as Product;
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch all categories
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const categoriesData = await response.json() as string[];
    
    // Transform the string array into Category objects
    return categoriesData.map(category => ({
      slug: category,
      name: category.replace(/-/g, ' '),
      url: `${BASE_URL}/products/category/${category}`
    }));
  } catch (error) {
    return handleApiError(error);
  }
};

// Get products by category
export const getProductsByCategory = async (
  category: string,
  options: { limit?: number; skip?: number } = {}
): Promise<ProductsResponse> => {
  const { limit = 10, skip = 0 } = options;
  
  try {
    const response = await fetch(
      `${BASE_URL}/products/category/${category}?limit=${limit}&skip=${skip}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json() as ProductsResponse;
  } catch (error) {
    return handleApiError(error);
  }
};

// Search products
export const searchProducts = async (
  query: string,
  options: { limit?: number; skip?: number } = {}
): Promise<ProductsResponse> => {
  const { limit = 10, skip = 0 } = options;
  
  try {
    const response = await fetch(
      `${BASE_URL}/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json() as ProductsResponse;
  } catch (error) {
    return handleApiError(error);
  }
};
