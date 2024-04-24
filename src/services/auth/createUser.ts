"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

type VerifyEmailPayloadT = {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
};
export function useCreateUser() {
  const router = useRouter();
  const { toast } = useToast();
  return useMutation({
    onSuccess: (response) => {
      if (response && response.status === 201) {
        router.push(`${baseURL}/email-verification`);
        toast({
          title: "Success",
          description: "Please check your email to verify your account",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description: "User with this email or username already exists",
          variant: "destructive",
        });
      }
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
    mutationFn: async (payload: VerifyEmailPayloadT) => {
      const response = await fetch(`${baseURL}/api/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          username: payload.username,
          password: payload.password,
          confirmPassword: payload.confirmPassword,
        }),
      });
      return response.json();
    },
  });
}

const ERROR_CODES: Record<string, string> = {
  "409": "User with this email or username already exists",
};
