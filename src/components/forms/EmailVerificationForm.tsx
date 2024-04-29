"use client";

import {
  useCheckVerification,
  useVerifyEmail,
} from "@/services/auth/emailVerification";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { RedirectStatusCode } from "next/dist/client/components/redirect-status-code";

const FormSchema = z.object({
  verificationCode: z.string().length(4),
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EmailVerificationForm() {
  const [isTokenSent, setIsTokenSent] = useState(false);
  const { mutateAsync, error } = useVerifyEmail();
  const { mutateAsync: checkToken } = useCheckVerification();
  const { toast } = useToast();
  const router = useRouter();
  const { data: session, update, status } = useSession();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  useEffect(() => {
    console.log(status);
    if (session?.user?.emailVerified) {
      router.push(`${BASE_URL}/home`);
    }
  }, [session, router, status]);

  console.log(status);
  if (status === "loading") {
    return <div>Loading...</div>;
  }
  const handleTokenChange = async () => {
    toast({
      title: "Code Sent",
      description: "Please check your email for the verification code",
      variant: "success",
    });
    const email = session?.user.email;
    console.log(email);

    if (!email) {
      toast({
        title: "Error",
        description: "An error occurred, please try again",
        variant: "destructive",
      });
      return;
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
        title: "Error",
        description: "Code should be a number",
        variant: "destructive",
      });
    }
    const email = session?.user.email;

    if (!email) {
      return toast({
        title: "Error",
        description: "An error occurred, please sign in again",
        variant: "destructive",
      });
    }
    const data = await checkToken({
      email: email,
      token: tokenCode,
    });

    if (!data.isValid) {
      return toast({
        title: "Error",
        description: "Invalid code, please try again",
        variant: "destructive",
      });
    }

    router.push(`${BASE_URL}/home`);
  };

  return (
    <>
      {session && !session.user.emailVerified && (
        <Form {...form}>
          <div className="flex flex-col gap-y-7 ">
            <h1 className="text-[28px] font-bold">Email Verification</h1>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-10"
            >
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="verificationCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center justify-center rounded-lg border">
                          <Input
                            className="m-1 border-none focus:ring-transparent focus-visible:ring-transparent"
                            placeholder="Verification Code"
                            {...field}
                          />
                          <Button
                            type="button"
                            disabled={isTokenSent}
                            onClick={handleTokenChange}
                            className="m-1 bg-[#eef6fe] text-[#2680eb] hover:cursor-pointer hover:bg-blue-200"
                          >
                            Send Code
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="bg-sky-600 text-white">
                Verify
              </Button>
            </form>
            <Link
              className="ml-auto p-3 text-sky-600 hover:text-sky-800"
              href={`${BASE_URL}/sign-in`}
            >
              Back to Sign In
            </Link>
          </div>
        </Form>
      )}
    </>
  );
}
