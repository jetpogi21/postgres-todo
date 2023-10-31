"use client";
import { Button } from "@/components/ui/Button";
import { signOut } from "next-auth/react";
import React from "react";

const SignOutButton = () => {
  const handleSignOut = () => {
    signOut({
      callbackUrl: `${window.location.origin}/login`,
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
      className="rounded-full bg-secondary"
    >
      Logout
    </Button>
  );
};

export default SignOutButton;
