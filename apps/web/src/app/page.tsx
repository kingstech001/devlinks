"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import Loader from "@/components/loader";

export default function Page() {
  const [showSignIn, setShowSignIn] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { data: session } = authClient.useSession();

  useEffect(() => {
    // If user is already authenticated, redirect to links page
    if (session) {
      router.push("/links");
    } else {
      setIsLoading(false);
    }
  }, [session, router]);

  if (isLoading || session) {
    return <Loader />;
  }

  return showSignIn ? (
    <SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
  ) : (
    <SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
  );
}