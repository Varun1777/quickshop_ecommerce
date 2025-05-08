
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getCategories } from "../../services/api";
import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const Layout: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

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
