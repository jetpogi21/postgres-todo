import { supabase } from "@/lib/supabase/supabase";

interface SignInProps {
  email: string;
  password: string;
}
export const signIn = async ({ email, password }: SignInProps) => {
  const {
    error,
    data: { user, session },
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { user, session };
};

export const signInWithGoogle = async () => {
  const {
    error,
    data: { provider, url },
  } = await supabase.auth.signInWithOAuth({ provider: "google" });

  if (error) {
    return { error: error.message };
  }

  return { provider, url };
};
