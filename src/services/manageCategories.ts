"use client";

import { useMutation } from "@tanstack/react-query";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export function useAddCategory() {
  return useMutation({
    mutationFn: async (payload: { name: string }) => {
      const response = await fetch(`${baseURL}/api/category`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response.json();
    },
  });
}

export function useGetCategories() {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseURL}/api/category`, {
        method: "GET",
      });

      return response.json();
    },
  });
}
