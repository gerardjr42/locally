"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DetailsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthday: "",
    zipCode: "",
  });
  const [errors, setErrors] = useState({
    birthday: "",
    zipCode: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "birthday") {
      validateAge(value);
    } else if (name === "zipCode") {
      validateZipCode(value);
    }
  };

  const validateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      setErrors((prev) => ({
        ...prev,
        birthday: "You must be at least 18 years old.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, birthday: "" }));
    }
  };

  const validateZipCode = (zipCode) => {
    if (zipCode.length !== 5 || !/^\d+$/.test(zipCode)) {
      setErrors((prev) => ({
        ...prev,
        zipCode: "Zip code must be exactly 5 digits.",
      }));
    } else {
      setErrors((prev) => ({ ...prev, zipCode: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || errors.birthday || errors.zipCode) {
      console.error("Validation failed");
      return;
    }

    try {
      const { data, error } = await supabase.from("Users").insert([
        {
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          photo_url: "",
          bio: "",
          user_dob: formData.birthday,
          user_zipcode: formData.zipCode,
        },
      ]);

      if (error) throw error;

      console.log("User details saved successfully:", data);

      router.push("/register/aboutme");
    } catch (error) {
      console.error("Error saving user details:", error.message);
    }
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.birthday &&
      formData.zipCode &&
      !errors.birthday &&
      !errors.zipCode
    );
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/register/details")}
        >
          <ArrowLeft className="mr-2 h-10 w-4" />
        </Button>

        <div className="mb-6">
          <Progress value={20} className="h-2" />
          <div className="flex justify-between mt-2 text-sm font-medium text-[#0D9488]">
            <span>Profile Creation</span>
            <span>20%</span>
          </div>
        </div>

        <div className="text-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your basic info</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="birthday">Birthday</Label>
            <Input
              type="date"
              id="birthday"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
            {errors.birthday && (
              <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>
            )}
          </div>
          <div>
            <Label htmlFor="zipCode">Zip Code</Label>
            <Input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-[#0D9488] hover:bg-[#0B7A6E] text-white"
            disabled={!isFormValid()}
            onClick={() => router.push("/register/photo")}
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
}
