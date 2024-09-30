"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./registrationPhoto.scss";

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
      // Upload file to 'user-avatars' bucket
      const { data, error: uploadError } = await supabase.storage
        .from("user-avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("user-avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      // Update the Users table with the new photo URL
      const { error: updateError } = await supabase
        .from("Users")
        .update({ photo_url: publicUrl })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      console.log(
        "Profile photo uploaded and user record updated successfully"
      );
      setAvatarUrl(publicUrl);
      router.push("/register/interests");
    } catch (error) {
      console.error("Error in handleUpload:", error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="loading-bar"></div>
        <h1>UPLOAD YOUR PHOTO</h1>
        <Avatar className="w-32 h-32 mx-auto mb-4">
          <AvatarImage src={avatarUrl} alt="User avatar" />
          <AvatarFallback>
            <img
              className="icon"
              src="https://cdn3.iconfinder.com/data/icons/general-bio-data-people-1/64/identity_card_man-512.png"
              alt="Default avatar"
            />
          </AvatarFallback>
        </Avatar>
        <form className="form" onSubmit={handleUpload}>
          <label className="photoUpload" htmlFor="photoUpload">
            Upload Photo
          </label>
          <input
            type="file"
            id="photoUpload"
            onChange={handleFileChange}
            accept="image/*"
          />
          <button
            className="skip-button button"
            type="button"
            onClick={() => router.push("/register/interests")}
          >
            Skip For now
          </button>
          <button
            className="continue-button"
            type="submit"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
