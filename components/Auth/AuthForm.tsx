"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type AuthFormValues = z.infer<typeof schema>;

export default function AuthForm({ type }: { type: "login" | "signup" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({ resolver: zodResolver(schema) });

  const [message, setMessage] = useState("");

  const router = useRouter();

  const onSubmit = async (data: AuthFormValues) => {
    setMessage("");

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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-bold">{type === "signup" ? "Sign Up" : "Log In"}</h2>
      <input {...register("email")} placeholder="Email" className="input" />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <input {...register("password")} type="password" placeholder="Password" className="input" />
      {errors.password && <p className="text-red-500">{errors.password.message}</p>}

      <button type="submit" className="btn">
        {type === "signup" ? "Sign Up" : "Log In"}
      </button>

      {message && <p className="text-sm text-blue-600">{message}</p>}
    </form>
  );
}
