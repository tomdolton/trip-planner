"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { supabase } from "@/lib/supabase";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof schema>;

export default function AuthForm({ type }: { type: "login" | "signup" }) {
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const onSubmit = async (data: AuthFormValues) => {
    setMessage("");
    setIsLoading(true);

    try {
      if (type === "signup") {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        if (error) setMessage(error.message);
        else setMessage("Check your email to confirm sign up!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) setMessage(error.message);
        else {
          setMessage("Logged in!");
          router.push("/trips");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight">
          {type === "signup" ? "Create an account" : "Sign in to your account"}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {type === "signup"
            ? "Enter your details to get started"
            : "Enter your credentials to access your trips"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    disabled={isLoading}
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                {type === "signup" ? "Creating account..." : "Signing in..."}
              </span>
            ) : type === "signup" ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>

          {message && (
            <div
              className={`text-sm text-center p-3 rounded-md ${
                message.includes("error") || message.includes("Invalid")
                  ? "bg-destructive/15 text-destructive"
                  : "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400"
              }`}
            >
              {message}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
