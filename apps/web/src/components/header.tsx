"use client";

import Link from "next/link";

import UserMenu from "./user-menu";

const Header = () => {
  const links = [
    { label: "befday", to: "/" },
    { label: "blog", to: "/blog" },
  ] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => (
            <Link key={to} href={to}>
              {label}
            </Link>
          ))}
        </nav>

        <UserMenu />
      </div>
      <hr />
    </div>
  );
};

export default Header;
