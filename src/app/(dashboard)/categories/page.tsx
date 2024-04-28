"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNotes } from "@/providers/NotesProvider";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  name: z.string().min(1),
});

export default function CategoryPage() {
  const { createCategory, categories, deleteCategory } = useNotes();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    createCategory(values.name.toLowerCase());

    form.reset();
  };

  const removeCategory = (id: number) => {
    deleteCategory(Number(id));
  };
  return (
    <div className="bg-white m-10 dark:bg-gray-950 p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <Form {...form}>
          <form className="flex gap-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-gray-100 dark:bg-gray-800 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                      placeholder="New Category"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-primary-500 hover:bg-primary-600  border rounded-full  text-zinc-700 py-2 px-4"
              size="sm"
            >
              Add
            </Button>
          </form>
        </Form>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories &&
          categories.map((category) => (
            <div
              key={category.id}
              style={{ backgroundColor: category.color }}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
            >
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {category.name[0].toUpperCase() + category.name.slice(1)}
              </span>
              <Button
                className="text-gray-500 hover:bg-inherit hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                size="icon"
                variant="ghost"
                onClick={() => removeCategory(category.id)}
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
