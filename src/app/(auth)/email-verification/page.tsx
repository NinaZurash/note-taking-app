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

const FormSchema = z.object({
  verificationCode: z.string().length(4),
});

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EmailVerificationPage() {
  const [isTokenSent, setIsTokenSent] = useState(false);
  const { mutateAsync, error } = useVerifyEmail();
  const { mutateAsync: checkToken } = useCheckVerification();
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  useEffect(() => {
    if (session && session.user.emailVerified) {
      router.push(`${BASE_URL}/`);
    }
  });
  const handleTokenChange = async () => {
    toast({
      title: "კოდი გაგზავნილია",
      description: "გთხოვთ შეამოწმოთ ელფოსტა",
      variant: "success",
    });

    const email = localStorage.getItem("email");

    if (!email) {
      toast({
        title: "შეცდომა",
        description: "დაფიქსირდა შეცდომა, სცადეთ მოგვიანებით",
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
        title: "შეცდომა",
        description: "კოდი უნდა იყოს ციფრებისგან შემდგარი",
        variant: "destructive",
      });
    }
    const email = localStorage.getItem("email");

    if (!email) {
      return toast({
        title: "შეცდომა",
        description: "დაფიქსირდა შეცდომა, სცადეთ მოგვიანებით",
        variant: "destructive",
      });
    }
    const data = await checkToken({
      email: email,
      token: tokenCode,
    });
    if (!data.isValid) {
      return toast({
        title: "შეცდომა",
        description: "კოდი არასწორია",
        variant: "destructive",
      });
    }

    router.push(`${BASE_URL}/`);
  };
  return (
    <Form {...form}>
      <div className="flex flex-col gap-y-7 ">
        <h1 className="text-[28px] font-bold">იმეილის ვერიფიკაცია</h1>
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
                        placeholder="ერთჯერადი კოდი"
                        {...field}
                      />
                      <Button
                        type="button"
                        disabled={isTokenSent}
                        onClick={handleTokenChange}
                        className="m-1 bg-[#eef6fe] text-[#2680eb] hover:cursor-pointer hover:bg-blue-200"
                      >
                        კოდის მიღება
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <SubmitButton title="გაგრძელება" /> */}
        </form>
        <Link
          className="ml-auto p-3 text-sky-600 hover:text-sky-800"
          href={`${BASE_URL}/sign-in`}
        >
          დაბრუნება
        </Link>
      </div>
    </Form>
  );
}
