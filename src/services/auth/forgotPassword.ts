"use client";

import { useMutation } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await fetch(`${BASE_URL}/api/forgot-password`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response.json();
    },
  });
}

export function useCheckForgotPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string; token: number }) => {
      const response = await fetch(
        `${BASE_URL}/api/forgot-password?email=${payload.email}&token=${payload.token}`,
        {
          method: "GET",
        }
      );

      return response.json();
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const response = await fetch(`${BASE_URL}/api/reset-password`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response;
    },
  });
}
