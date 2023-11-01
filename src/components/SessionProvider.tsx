"use client";
import { supabase } from "@/lib/supabase/supabase";
import { useSessionStore } from "@/lib/supabase/useAuthSession";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SessionProvider = () => {
  const router = useRouter();
  const { setSession, setLoading } = useSessionStore((state) => ({
    setSession: state.setSession,
    setLoading: state.setLoading,
  }));

  const { data } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      return await supabase.auth.getUser();
    },
  });

  const user = data?.data.user;

  useEffect(() => {
    setSession(user);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        switch (event) {
          case "SIGNED_IN":
            setSession(session?.user);
            break;
          case "SIGNED_OUT":
            setSession(undefined);
            router.push("/login");
            break;
          case "PASSWORD_RECOVERY":
            setSession(undefined);
            console.log("Password recovery action triggered in session.");
            break;
          case "USER_UPDATED":
            setSession(session?.user);
            console.log("User update action triggered in session.");
            break;
          case "INITIAL_SESSION":
            break;
          default:
            console.log("Unrecognized event in session.");
        }

        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  return null;
};

export default SessionProvider;
