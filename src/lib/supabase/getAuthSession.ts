import { supabase } from "@/lib/supabase/supabase";

export const getAuthSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    return null;
  }

  return data.session;
};
