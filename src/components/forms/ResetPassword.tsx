"use client";

import { useState } from "react";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import {
  useCheckForgotPassword,
  useForgotPassword,
  useResetPassword,
} from "@/services/auth/forgotPassword";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import Link from "next/link";
import { ArrowLeftToLine } from "lucide-react";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const FormSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password do not match",
  });

export default function ResetPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { mutateAsync, error } = useResetPassword();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const email = localStorage.getItem("email");

    if (!email) {
      toast({
        title: "Error",
        description: "Try again later",
        variant: "destructive",
      });
      return;
    }
    const response = await mutateAsync({
      password: values.password,
      email: email,
    });
    if (response.status === 200) {
      toast({
        title: "Success",
        description: "Password changed successfully",
        variant: "success",
      });
      setTimeout(() => {
        router.push(`${BASE_URL}/sign-in`);
      }, 1000);
    } else {
      toast({
        title: "Error",
        description: "Something went wrong, try again later",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-7 ">
        <h1 className="text-[28px] font-bold">Forgot Password</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-10"
        >
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center justify-center rounded-lg border">
                      <Input
                        type="password"
                        className="m-1 p-6 border-none focus:ring-transparent focus-visible:ring-transparent"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center justify-center rounded-lg border">
                      <Input
                        type="password"
                        className="m-1 p-6 border-none focus:ring-transparent focus-visible:ring-transparent"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button>Submit Password</Button>
        </form>
        <Link
          className="flex items-center gap-2 ml-auto p-3 hover:text-gray-600"
          href={`${BASE_URL}/sign-in`}
        >
          Back to sign in <ArrowLeftToLine size={16} />
        </Link>
      </div>
    </Form>
  );
}
