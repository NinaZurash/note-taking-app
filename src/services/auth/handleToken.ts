"use client";

import { useMutation } from "@tanstack/react-query";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await fetch(`${baseURL}/api/forgot-password`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response.json();
    },
  });
}

export function useResetToken() {
  return useMutation({
    mutationFn: async (payload: { email: string; token: number }) => {
      const response = await fetch(
        `${baseURL}/api/forgot-password?email=${payload.email}&token=${payload.token}`,
        {
          method: "GET",
        },
      );

      return response.json();
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await fetch(`${baseURL}/api/reset-password`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response;
    },
  });
}
