import { redirect } from "next/navigation";
import { LoginForm } from "@/components/login/LoginForm";
import { getAuthSession } from "@/lib/auth";

const Login = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const session = await getAuthSession();
  const { error } = searchParams;
  const hasError = Boolean(error);

  if (session?.user) {
    redirect("/");
  }

  return <LoginForm hasError={hasError} />;
};

export default Login;
