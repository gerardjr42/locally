import ParticleBackground from "@/components/ParticleBackground";
import RegistrationForm from "@/components/RegistrationForm";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

export default function Registration() {
  return (
    <div className="relative min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <ParticleBackground />
      <div className="z-10 w-full max-w-md space-y-8 bg-white p-8 rounded-lg">
        <div className="text-center">
          <Image
            src="/images/logo.png"
            alt="Locally Logo"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-teal-600">
            Create an Account
          </h2>
        </div>

        <RegistrationForm />

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-teal-600 hover:text-teal-500"
          >
            Log in
          </Link>
        </p>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
