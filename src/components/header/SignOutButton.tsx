"use client";
import { Button } from "@/components/ui/Button";
import { signOut } from "@/lib/supabase/signOut";
import React from "react";

const SignOutButton = () => {
  const handleSignOut = async () => {
    await signOut();
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
