"use client";

import { useState } from "react";
import { z } from "zod";
import { useToast } from "../ui/use-toast";
import {
  useCheckForgotPassword,
  useForgotPassword,
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

const FormSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  verificationCode: z
    .string()
    .refine(
      (value) => /^\d{4}$/.test(value),
      "Verification code must be a 4-digit number"
    ),
});

export default function ForgotPasswordForm() {
  const [isTokenSent, setIsTokenSent] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const { mutateAsync } = useForgotPassword();
  const { mutateAsync: checkToken } = useCheckForgotPassword();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      verificationCode: "",
    },
  });

  const handleTokenChange = async (email: string) => {
    if (!email) {
      return toast({
        title: "error",
        description: "Please, enter your email.",
        variant: "destructive",
      });
    }
    const data = await mutateAsync({ email: email });
    setIsTokenSent(true);
    const setTokenTimer = setTimeout(() => {
      setIsTokenSent(false);
    }, 60000);
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const tokenCode = parseInt(values.verificationCode);
    if (isNaN(tokenCode)) {
      return toast({
        title: "error",
        description: "Please, enter a valid code.",
        variant: "destructive",
      });
    }
    const email = values.email;
    if (!email) {
      return toast({
        title: "error",
        description: "Please, try again later.",
        variant: "destructive",
      });
    }
    const data = await checkToken({
      email: email,
      token: tokenCode,
    });
    if (!data.isValid) {
      return toast({
        title: "error",
        description: "Please enter a valid code.",
        variant: "destructive",
      });
    }
    localStorage.setItem("email", values.email);
    router.push(`${BASE_URL}/reset-password`);
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center justify-center rounded-lg border">
                      <Input
                        className="m-1 p-6 border-none focus:ring-transparent focus-visible:ring-transparent"
                        placeholder="Enter your email"
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
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center justify-center rounded-lg border">
                      <Input
                        className="m-1 p-6 border-none focus:ring-transparent focus-visible:ring-transparent"
                        placeholder="one-time code"
                        {...field}
                      />
                      <Button
                        type="button"
                        disabled={isTokenSent}
                        onClick={() => {
                          handleTokenChange(form.getValues().email);
                        }}
                        className="px-5 py-6 hover:bg-slate-700"
                      >
                        {isTokenSent ? "code sent!" : "send code"}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button>Submit code</Button>
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
