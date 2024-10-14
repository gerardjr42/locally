"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function UserUploadPhoto() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("photo_url")
        .eq("user_id", user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setAvatarUrl(data.photo_url);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setAvatarUrl(previewUrl);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !user) {
      console.error("No file or user found");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}.${fileExt}`;

    try {
      const { data, error: uploadError } = await supabase.storage
        .from("user-avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("user-avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("Users")
        .update({ photo_url: publicUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      console.log(
        "Profile photo uploaded and user record updated successfully"
      );
      setAvatarUrl(publicUrl);
      router.push("/register/verification");
    } catch (error) {
      console.error("Error in handleUpload:", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleClick = (e) => {
    handleUpload(e);
    router.push("/register/verification");
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/register/interests")}
        >
          <ArrowLeft className="mr-2 h-10 w-4" />
        </Button>

        <div className="mb-6">
          <Progress value={80} className="h-2" />
          <div className="flex justify-between mt-2 text-sm font-medium text-[#0D9488]">
            <span>Profile Creation</span>
            <span>80%</span>
          </div>
        </div>

        <div className="text-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add a photo</h2>
          <p className="text-sm text-gray-600 mt-2">
            Add a photo to help others recognize you
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center">
            {avatarUrl ? (
              <div className="relative w-48 h-48">
                <Image
                  src={avatarUrl}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            ) : (
              <div className="w-48 h-48 bg-gray-200 rounded-full flex items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0D9488] hover:bg-[#0B7A6E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D9488] cursor-pointer"
          >
            {avatarUrl ? "Change Photo" : "Upload Photo"}
          </label>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleClick}
            className="bg-[#0D9488] hover:bg-[#0B7A6E] text-white w-full max-w-xs"
            disabled={uploading || (!file && !avatarUrl)}
          >
            Continue
          </Button>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
