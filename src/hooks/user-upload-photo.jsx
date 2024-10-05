'use client';
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Image from 'next/image'
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Upload } from "lucide-react"

export default function UserUploadPhoto() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const newParticles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * 2 - 1,
    }))
    setParticles(newParticles)

    const animateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => ({
          ...particle,
          x: (particle.x + particle.speedX + window.innerWidth) % window.innerWidth,
          y: (particle.y + particle.speedY + window.innerHeight) % window.innerHeight,
        })))
    }

    const intervalId = setInterval(animateParticles, 50)
    return () => clearInterval(intervalId);
  }, [])

  useEffect(() => {
    if (user) {
      getProfile()
    }
  }, [user])

  const getProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("Users")
        .select("photo_url")
        .eq("user_id", user.id)
        .single()

      if (error) {
        throw error
      }

      if (data) {
        setAvatarUrl(data.photo_url)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error.message)
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile)
      setAvatarUrl(previewUrl)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file || !user) {
      console.error("No file or user found")
      return
    }

    setUploading(true)
    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}.${fileExt}`

    try {
      const { data, error: uploadError } = await supabase.storage
        .from("user-avatars")
        .upload(fileName, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from("user-avatars")
        .getPublicUrl(fileName)

      const publicUrl = publicUrlData.publicUrl

      const { error: updateError } = await supabase
        .from("Users")
        .update({ photo_url: publicUrl })
        .eq("user_id", user.id)

      if (updateError) throw updateError

      console.log("Profile photo uploaded and user record updated successfully")
      setAvatarUrl(publicUrl)
      router.push("/register/interests")
    } catch (error) {
      console.error("Error in handleUpload:", error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    (<div
      className="relative min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full bg-teal-500 opacity-20"
            animate={{
              x: particle.x,
              y: particle.y,
            }}
            transition={{
              duration: 0,
              repeat: Infinity,
              repeatType: "loop",
            }}
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }} />
        ))}
      </div>
      <div
        className="z-10 w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <Button variant="ghost" className="mb-4" onClick={() => router.push("/register")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="mb-6">
          <Progress value={66} className="h-2" />
          <div className="flex justify-between mt-2 text-sm font-medium text-[#0D9488]">
            <span>Profile Creation</span>
            <span>66%</span>
          </div>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">UPLOAD YOUR PHOTO</h2>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-48 h-48 mx-auto mb-6 relative rounded-full overflow-hidden border-4 border-[#0D9488]">
          {avatarUrl ? (
            <Image src={avatarUrl} alt="User avatar" layout="fill" objectFit="cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Upload className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </motion.div>

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="flex justify-center">
            <label
              htmlFor="photoUpload"
              className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center transition duration-300 ease-in-out">
              <Upload className="mr-2 h-4 w-4" />
              <span>Choose Photo</span>
              <input
                type="file"
                id="photoUpload"
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" />
            </label>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-[#0D9488] hover:bg-[#0B7A6E] text-white transition duration-300 ease-in-out"
            disabled={uploading || !file}>
            {uploading ? "Uploading..." : "Continue"}
          </Button>
        </form>
      </div>
    </div>)
  );
}