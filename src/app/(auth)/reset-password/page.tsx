import ResetPasswordForm from "@/components/ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <div className="flex flex-col items-center flex-1 text-sm">
      <h1 className="my-5 text-5xl">Reset Password</h1>
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPasswordPage;
