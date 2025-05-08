
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearchParams } from "react-router-dom";

const SortOptions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get("sort") || "";
  const currentOrder = searchParams.get("order") || "asc";

  const handleSortChange = (sort: string, order: "asc" | "desc") => {
    if (sort) {
      searchParams.set("sort", sort);
      searchParams.set("order", order);
    } else {
      searchParams.delete("sort");
      searchParams.delete("order");
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
  };

  const getSortLabel = () => {
    if (!currentSort) return "Default";
    if (currentSort === "price") {
      return `Price: ${currentOrder === "asc" ? "Low to High" : "High to Low"}`;
    }
    if (currentSort === "rating") {
      return `Rating: ${currentOrder === "asc" ? "Low to High" : "High to Low"}`;
    }
    return "Default";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ArrowUpDown className="h-4 w-4" />
          <span>Sort: {getSortLabel()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => handleSortChange("", "asc")}>
          Default
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("price", "asc")}>
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("price", "desc")}>
          Price: High to Low
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("rating", "desc")}>
          Rating: High to Low
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSortChange("rating", "asc")}>
          Rating: Low to High
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SortOptions;
