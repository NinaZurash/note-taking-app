"use client";

import { NoteInput, NoteType } from "@/types/noteTypes";
import { Category, Note } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export function useAddNote() {
  return useMutation({
    mutationFn: async (payload: NoteInput) => {
      const response = await fetch(`${baseURL}/api/notes`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response.json();
    },
  });
}

export function useUpdateNote() {
  return useMutation({
    mutationFn: async (payload: NoteInput & { id: number }) => {
      const response = await fetch(`${baseURL}/api/notes`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      return response.json();
    },
  });
}

export function useGetNotes() {
  return useMutation({
    mutationFn: async () => {
      const response = await fetch(`${baseURL}/api/notes`, {
        method: "GET",
      });

      return response.json();
    },
  });
}

export function useDeleteNote() {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${baseURL}/api/notes?id=${id}`, {
        method: "DELETE",
      });

      return response.json();
    },
  });
}
