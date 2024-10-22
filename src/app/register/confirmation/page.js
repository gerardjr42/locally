"use client";

import { useRouter } from "next/navigation";
import "./confirmation.scss";

export default function ConfirmationPage() {
  const router = useRouter();

  const handleLoginRedirect = () => {
    router.push("/experiences");
  };

  return (
    <div className="ConfirmationPage">
      <div>
        <h1>Welcome!</h1>
        <h2>You are now a member of the Locally community!</h2>
        <button onClick={handleLoginRedirect}>Get Started</button>
      </div>
    </div>
  );
}
