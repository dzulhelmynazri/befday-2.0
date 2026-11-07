import type { Metadata } from "next";

import AuthForm from "@/components/auth-form";

export const metadata: Metadata = {
  alternates: {
    canonical: "/auth",
  },
  description: "Sign in to your befday account with Google.",
  title: "Welcome Back",
};

const LoginPage = () => (
  <main className="flex flex-1 items-center justify-center p-4 py-12 sm:p-8">
    <AuthForm />
  </main>
);

export default LoginPage;
