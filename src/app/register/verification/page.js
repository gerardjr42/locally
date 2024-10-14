"use client";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function UserVerification() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const bindIDme = (element) => {
    if (element) {
      element.addEventListener("click", () => {
        console.log("ID.me verification initiated");
        setIsVerified(true);
      });
    }
  };

  useEffect(() => {
    const idmeButton = document.getElementById("idme-wallet-button");
    if (idmeButton) {
      bindIDme(idmeButton);
    }
  }, []);

  const accountOptions = [
    {
      id: "instagram",
      name: "Instagram",
      icon: "https://cdn-icons-png.freepik.com/256/15707/15707869.png?semt=ais_hybrid",
      connectText: "Connect Your Instagram Account",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "https://static.vecteezy.com/system/resources/previews/016/716/481/non_2x/facebook-icon-free-png.png",
      connectText: "Connect Your Facebook Account",
    },
  ];

  const handleButtonClick = () => {
    router.push("/register/confirmation");
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg p-4">
        <PageHeader
          onBackClick={() => router.push("/register/photo")}
          progressValue={95}
          progressText="95%"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto p-6"
        >
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Connect Accounts</h2>
              <hr className="mb-4" />
              {accountOptions.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-4 mb-4"
                >
                  <Checkbox id={option.id} />
                  <label
                    htmlFor={option.id}
                    className="flex items-center space-x-4 cursor-pointer"
                  >
                    <img
                      src={option.icon}
                      alt={option.name}
                      width={40}
                      height={40}
                      className="w-10 h-10"
                    />
                    <div>
                      <p className="font-semibold">{option.name}</p>
                      <p className="text-sm text-gray-600">
                        {option.connectText}
                      </p>
                    </div>
                  </label>
                </div>
              ))}
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Third Party</h2>
              <hr className="mb-4" />
              <p className="text-gray-600 mb-4">
                Locally uses ID.me to verify users for added safety on our
                platform. Click here to verify.
              </p>
              <Button
                id="idme-wallet-button"
                data-scope="military,responder,student,teacher,government"
                variant="outline"
                className="w-full bg-green-600 text-white"
              >
                Verify with ID.me
              </Button>
            </section>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleButtonClick}>
                Skip For Now
              </Button>
              <Button disabled={!isVerified} onClick={handleButtonClick}>
                Continue
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
