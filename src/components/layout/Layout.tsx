
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getCategories, Category } from "../../services/api";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";

const Layout: React.FC = () => {
  // Use React Query for efficient data fetching and caching
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // Cache categories for 1 hour
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header categories={categories} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Layout;
