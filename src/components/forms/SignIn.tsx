"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const FormSchema = z.object({
  username: z.string().min(1, "Email or username is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have than 8 characters"),
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const SignInForm = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // if (session?.user) {
  //   return router.push(`${BASE_URL}/`);
  // }

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const user = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    console.log(user);

    if (!user || user.status === 401) {
      return toast({
        title: "Error",
        description: "Email or password is incorrect",
        variant: "destructive",
      });
    } else {
      return router.push(`${BASE_URL}/email-verification`);
      //   // return router.push(`${BASE_URL}/`);
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-8 ">
        <h1 className="text-[35px] font-bold">Sign in</h1>
        <form
          className="flex flex-col gap-8"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-14"
                      placeholder="Enter your email or username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="h-14"
                      type="password"
                      placeholder="Enter password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="text-right text-sm font-medium text-slate-700">
            <Link href="/forgot-password">Forgot password?</Link>
          </div>
          <Button>Sign in</Button>
        </form>

        <p className="flex justify-center gap-x-2 text-center  text-gray-400">
          <span> Dont have an account?</span>
          <Link
            className="text-blue-500 hover:underline"
            href={`${BASE_URL}/sign-up`}
          >
            - Create an account
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SignInForm;
