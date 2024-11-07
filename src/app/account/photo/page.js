"use client";
import { NavigationBar } from "@/components/navigation-bar";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase"; // Adjust the path as needed
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AccountPhoto() {
  const { user, setUser, deleteUserPhoto } = useUserContext();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    console.log("User data in useEffect:", user);
    if (user) {
      setAvatarUrl(user.photo_url || null);
    }
  }, [user]);

  // const handleBackClick = () => {
  //   router.push("/account");
  // };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setAvatarUrl(previewUrl);
    }
  };

  // Handle the upload process and update the database
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      console.error("No file found");
      alert("Please select a file to upload.");
      return;
    }
    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`; // Using timestamp for unique filename
    try {
      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        throw new Error("No authenticated user found");
      }
      console.log("Deleting old photo...");
      await deleteUserPhoto(); // Call deleteUserPhoto from useUserContext
      console.log("Uploading file:", file.name);
      const { data, error: uploadError } = await supabase.storage
        .from("user-avatars")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from("user-avatars")
        .getPublicUrl(fileName);
      if (urlError) throw urlError;
      const publicUrl = publicUrlData.publicUrl;
      console.log("Public URL of the uploaded photo:", publicUrl);
      const { error: updateError } = await supabase
        .from("Users")
        .update({ photo_url: publicUrl })
        .eq("user_id", user.id);
      if (updateError) throw updateError;
      // Update the user context with the new photo URL
      setUser((prevUser) => ({
        ...prevUser,
        photo_url: publicUrl,
      }));
      console.log("User data after update:", {
        ...user,
        photo_url: publicUrl,
      });
      console.log(
        "Profile photo uploaded and user record updated successfully"
      );
      setAvatarUrl(publicUrl);
      alert("Photo updated successfully!");
      router.push("/account"); // Redirecting to /account instead of /register/verification
    } catch (error) {
      console.error("Error in handleUpload:", error);
      alert("Error updating photo: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white-100 min-h-screen">
      <header className="bg-white p-4 flex justify-between items-center shadow-sm">
        <NavigationBar handleBackClick={() => router.back()} />
      </header>

      <div className="photo bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-center text-sm font-bold mb-4">ACCOUNT PHOTO</h2>

        <div className="flex justify-center">
          {avatarUrl || (user && user.photo_url) ? (
            <div className="relative w-48 h-48">
              <Image
                src={avatarUrl || user.photo_url} // Show uploaded image or existing user photo
                alt={`Profile photo of ${user?.first_name}`}
                layout="fill"
                objectFit="cover"
                priority // Optional: can improve loading speed
              />
            </div>
          ) : (
            <img
              src={user?.photo_url}
              alt={`Profile photo of ${user?.first_name}`}
              className="w-48 h-48 object-cover"
            />
          )}
        </div>
      </div>

      <div className="button-container mt-6 px-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="photo-upload"
        />

        <label
          htmlFor="photo-upload"
          id="button"
          className="block w-full text-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-[#0D9488] hover:bg-[#0B7A6E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0D9488] cursor-pointer "
        >
          <span className="mr-2">📷</span> Choose Photo
        </label>

        <button
          id="button"
          className="w-full px-6 py-2 bg-teal-600 text-white rounded-full mt-4"
          onClick={handleUpload} // Call upload function on button click
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
