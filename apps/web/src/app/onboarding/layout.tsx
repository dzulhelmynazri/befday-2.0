import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Complete your profile to unlock free birthday perks, drinks, and vouchers.",
  title: "Welcome to befday — Set Up Your Birthday",
};

const OnboardingLayout = ({ children }: LayoutProps<"/onboarding">) => (
  <div className="flex min-h-svh w-full flex-1 items-center justify-center p-4 py-8 sm:p-8">
    {children}
  </div>
);

export default OnboardingLayout;
