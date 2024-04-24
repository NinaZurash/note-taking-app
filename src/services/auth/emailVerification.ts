import { useMutation } from "@tanstack/react-query";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (payload: { email: string }) => {
      const response = await fetch(`${baseURL}/api/email-verification`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      return response.json();
    },
  });
}

export function useCheckVerification() {
  return useMutation({
    mutationFn: async (payload: { email: string; token: number }) => {
      const response = await fetch(
        `${baseURL}/api/email-verification?email=${payload.email}&token=${payload.token}`,
        {
          method: "GET",
        }
      );

      return response.json();
    },
  });
}
