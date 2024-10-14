"use client";

import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) throw error;

      toast.success("Password reset email sent. Check your inbox.");
      // Optionally, redirect to login page after a short delay
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-4 pt-8 overflow-hidden">
      <div className="absolute inset-0">
        <ParticleBackground />
      </div>
      <div className="z-10 w-full max-w-md space-y-8 bg-white p-8 rounded-lg">
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="Locally Logo"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-teal-600">Reset Password</h2>
        </div>

        <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Reset Password"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            href="/login"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            Log in
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            Sign up
          </Link>
        </p>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
