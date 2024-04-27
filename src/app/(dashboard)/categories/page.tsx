"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/providers/NotesProvider";
import { useState } from "react";

export default function CategoryPage() {
  const { createCategory, categories } = useNotes();
  const [newCategory, setNewCategory] = useState("");
  const handleAddCategory = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    createCategory(newCategory);
    setNewCategory("");
  };

  return (
    <div className="bg-white m-10 dark:bg-gray-950 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <form className="flex items-center gap-4">
          <Input
            className="bg-gray-100 dark:bg-gray-800 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            placeholder="New Category"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button
            className="bg-primary-500 hover:bg-primary-600  border rounded-full  text-zinc-700 py-2 px-4"
            size="sm"
            onClick={handleAddCategory}
          >
            Add
          </Button>
        </form>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
          >
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {category.name}
            </span>
            <Button
              className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              size="icon"
              variant="ghost"
            >
              <TrashIcon className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
