"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

export default function Profile() {
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { firstName, lastName, email, username, emailVerified } =
    session?.user || {};

  return session?.user ? (
    <div className="p-8 flex flex-col gap-10">
      <div className="flex items-center gap-5">
        <Avatar className="h-12 w-12">
          <AvatarImage alt="avatar" src="/placeholder-avatar.jpg" />
          <AvatarFallback className="font-medium">
            {firstName && lastName && firstName[0] + lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <div className="font-medium">
            {firstName && lastName && firstName + " " + lastName}
          </div>
          <div className="text-gray-500 dark:text-gray-400">{email}</div>
        </div>
      </div>
      <div className="w-1/2">
        <div className="flex justify-between">
          <span>First Name</span>
          <span className="text-gray-500">{firstName}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Name</span>
          <span className="text-gray-500">{lastName}</span>
        </div>
        <div className="flex justify-between">
          <span>Email</span>
          <span className="text-gray-500">{email}</span>
        </div>
        <div className="flex justify-between">
          <span>Username</span>
          <span className="text-gray-500">{username}</span>
        </div>
      </div>
      <div className="space-y-4 w-1/2 ">
        <div className="space-y-2">
          <h2 className="text-xl font-bold">Security</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Verification</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Your email is {emailVerified ? "verified" : "not verified"}.
              </p>
            </div>
            <Badge variant="secondary">
              {emailVerified ? "Verified" : "Not Verified"}
            </Badge>
          </div>
        </div>
        <div className="space-y-2">
          <Button className="w-full" variant="outline">
            Change Password
          </Button>
          <Button
            onClick={() => {
              signOut({ callbackUrl: `${BASE_URL}/sign-in` });
            }}
            className="w-full"
            variant="destructive"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
