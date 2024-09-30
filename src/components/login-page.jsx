"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { FaGoogle, FaLinkedin } from "react-icons/fa";

export function LoginPageComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast.success("Logged in successfully!");
      router.push("/dashboard"); // Redirect to dashboard or home page
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error("Error with Google login");
    }
  };

  const handleLinkedInLogin = () => {
    toast.error("LinkedIn login is not implemented yet");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg--900 p-4">
      <Card className="w-full max-w-[400px] bg-gray-800 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Log In
          </CardTitle>
          <p className="text-gray-400 text-sm text-center">
            Enter your email below to log in to your account
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent border-gray-600 hover:bg-gray-700"
              onClick={handleGoogleLogin}
            >
              <FaGoogle className="w-5 h-5 mr-2" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent border-gray-600 hover:bg-gray-700"
              onClick={handleLinkedInLogin}
            >
              <FaLinkedin className="w-5 h-5 mr-2" />
              LinkedIn
            </Button>
          </div>
          <div className="relative mb-6">
            <hr className="border-gray-600" />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 px-2 text-xs text-gray-400">
              OR CONTINUE WITH
            </span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#2AA598] hover:bg-[#238e83] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#2AA598] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
