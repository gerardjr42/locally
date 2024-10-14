"use client";

import ParticleBackground from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      setTimeout(() => router.push("/login"), 3000); // Redirect to login page after successful update
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
          <h2 className="text-3xl font-bold text-teal-600">Update Password</h2>
        </div>

        <form onSubmit={handleUpdatePassword} className="mt-8 space-y-6">
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="bg-white border-gray-300 text-gray-900 placeholder-gray-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
