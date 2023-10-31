import ResetPasswordForm from "@/components/ResetPasswordForm";
import axiosClient from "@/utils/api";
import { redirect } from "next/navigation";
import React from "react";

const validateToken = async (token: string) => {
  try {
    const { data } = await axiosClient.post(`auth/verify-pw-token/${token}`);

    return data;
  } catch (e: any) {
    console.log(e.response);
    redirect("/login");
  }
};

const ResetPasswordPage = async ({ params }: { params: { token: string } }) => {
  const data = await validateToken(params.token);
  const email = data.data.email;
  return (
    <div className="flex flex-col items-center flex-1 text-sm">
      <h1 className="my-5 text-5xl">Reset Password</h1>
      <ResetPasswordForm token={params.token} />
    </div>
  );
};

export default ResetPasswordPage;
