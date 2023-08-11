"use client";

import { Metadata } from "next";

import { UserAuthForm } from "@/components/UserAuthForm";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthForm() {
  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center lg:max-w-none grid lg:px-0">
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password below to login your account
              </p>
            </div>
            <UserAuthForm />
          </div>
        </div>
      </div>
    </>
  );
}
