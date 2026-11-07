import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Complete your profile to unlock free birthday perks, drinks, and vouchers.",
  title: "Welcome to befday — Set Up Your Birthday",
};

const OnboardingLayout = ({ children }: LayoutProps<"/onboarding">) => (
  <div className="flex min-h-svh w-full flex-col">{children}</div>
);

export default OnboardingLayout;
