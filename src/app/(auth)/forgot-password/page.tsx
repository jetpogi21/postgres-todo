"use client";
import * as Yup from "yup";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import Link from "next/link";
import { useState } from "react";
import axiosClient from "@/utils/api";
import { toast } from "@/hooks/use-toast";

interface FormValues {
  email: string;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Please enter a valid email address"),
});

const ForgotPasswordPage: React.FC = () => {
  return <EmailForm />;
};

const EmailForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleContinueClick = async () => {
    try {
      await validationSchema.validate({ email });

      const { data } = await axiosClient.post("/auth/forgot-password", {
        email,
      });

      const message = data.data.message;

      toast({
        description: message,
        variant: "success",
      });
    } catch (e: any) {
      console.log(e);
      setError(e.message);
    }
  };

  const handleEmailChange = (e: any) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  return (
    <div className="flex flex-col items-center flex-1 text-sm w-full max-w-[400px] mx-auto gap-8">
      <h1 className="my-5 text-4xl">Reset your password</h1>
      <p>
        Enter the email address associated with your account and we&apos;ll send
        you a link to reset your password.
      </p>
      <div className="flex flex-col w-full gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          value={email}
          onChange={handleEmailChange}
        />
        {Boolean(error) && (
          <span className="text-xs text-destructive">{error}</span>
        )}
      </div>
      <Button
        className="w-full"
        onClick={handleContinueClick}
      >
        Continue
      </Button>
      <div>
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
