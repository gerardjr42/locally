"use client";
import { useUserContext } from "@/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Camera, Heart, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export function NavigationBar({ handleBackClick }) {
  const { user, setUser } = useUserContext();
  const router = useRouter();

  const handleDrawerClick = () => {
    if (!user) {
      router.push("/login");
    }
  };

  const handleDetailsClick = () => {
    router.push("/account/details");
  };
  const handleProfileClick = () => {
    router.push("/account");
  };
  const handlePhotoClick = () => {
    router.push("/account/photo");
  };
  const handleVerificationClick = () => {
    router.push("/account/verification");
  };
  const handleInterestClick = () => {
    router.push("/account/interests");
  };
  const handlePreferencesClick = () => {
    router.push("/account/preferences");
  };
  const handleChatClick = () => {
    router.push("/connections/chats");
  };

  const handleConnectionClick = () => {
    router.push("/connections");
  };

  const handleExperienceClick = () => {
    router.push("/connections");
    // will direct to connections/savedexperiences when the route is created
  };

  const handleLogoClick = () => {
    router.push("/experiences");
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      router.push("/login");
      console.log(user);
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const navItems = [
    { title: "Details", icon: User, onClick: handleDetailsClick },
    { title: "Profile Photo", icon: Camera, onClick: handlePhotoClick },
    { title: "Interests", icon: Heart, onClick: handleInterestClick },
    // {
    //   title: "Connection Preferences",
    //   icon: Settings,
    //   onClick: handlePreferencesClick,
    // },
    // {
    //   title: "Identity Verification",
    //   icon: Shield,
    //   onClick: handleVerificationClick,
    // },
  ];

  return (
    <div className="drawer">
      <input
        id="account-menu-drawer"
        type="checkbox"
        className="drawer-toggle"
      />
      <div className="drawer-content flex flex-row justify-between p-3">
        <div>
          <button className="p-2">
            <ArrowLeft
              className="w-6 h-6 text-gray-600"
              onClick={handleBackClick}
            />
          </button>
        </div>
        <div>
          <Image
            src="/images/teallocally.png"
            alt="Locally Logo"
            className="h-12 w-auto"
            width={100}
            height={100}
            onClick={handleLogoClick}
          />
        </div>

        <div>
          <label
            htmlFor={user ? "account-menu-drawer" : undefined}
            className="drawer-button"
            onClick={!user ? handleDrawerClick : undefined}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </label>
        </div>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor="account-menu-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        {user && (
          <div className="bg-base-200 text-base-content min-h-full w-3/4 max-w-md flex flex-col">
            <ul className="menu p-4 flex-grow">
              <div className="flex flex-row justify-end">
                <Image
                  src="/images/teallocally.png"
                  alt="Locally Logo"
                  className="h-12 w-auto"
                  width={100}
                  height={100}
                />
              </div>
              <div className="container flex flex-row justify-between items-center w-90 px-2 py-3">
                <div className="avatar">
                  <div className="ring-primary ring-offset-base-100 w-20 rounded-full ring ring-offset-2 align-middle">
                    <Image
                      src={user.photo_url}
                      alt="Profile Picture"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-start">
                  <p className="text-lg text-gray-600">
                    Hello, <span className="font-bold">{user.first_name}</span>!
                  </p>
                  <a>
                    <p
                      className="text-gray-500  cursor-pointer"
                      onClick={handleProfileClick}
                    >
                      View Profile
                    </p>
                  </a>
                </div>
              </div>
              <p className="uppercase text-m mt-4 mb-2">Notifications</p>
              <li>
                <a className="flex flex-row justify-start hover:bg-base-300 hover:text-[#3FBDAC] transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                    />
                  </svg>
                  <div className="flex flex-col justify-start py-0.5 m-0.5">
                    <p onClick={handleChatClick}>Chats</p>
                  </div>
                </a>
              </li>
              <li>
                <a className="flex flex-row justify-start hover:bg-base-300 hover:text-[#3FBDAC] transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m-18 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    />
                  </svg>
                  <div className="flex flex-col justify-start py-0.5 m-0.5">
                    <p onClick={handleConnectionClick}>Experiences & Connections</p>
                  </div>
                </a>
              </li>
              {/* <li>
                <a className="flex flex-row justify-start hover:bg-base-300 hover:text-[#3FBDAC] transition-colors duration-200">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  <div className="flex flex-col justify-start py-0.5 m-0.5">
                    <p onClick={handleConnectionClick}>Experiences</p>
                  </div>
                </a>
              </li> */}

              <p className="uppercase text-m mt-4 mb-2">Account</p>
              {navItems.map((item, index) => (
                <li key={index} className="py-0.5 m-0.5">
                  <a
                    onClick={item.onClick}
                    className="flex items-center hover:bg-base-300 hover:text-[#3FBDAC] transition-colors duration-200"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>

            {/* Sign Out button at the bottom */}
            <div className="p-4 mt-auto">
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
