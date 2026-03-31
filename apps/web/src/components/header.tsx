"use client";

import Link from "next/link";
import { BookUser, CircleUser, Link as LinkIcon, Menu } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { to: "/links", label: "Links", icon: <LinkIcon size={16} /> },
    { to: "/profile", label: "Profile Details", icon: <BookUser size={16} />  },
  ] as const;

  return (
    <header className="w-full border-b bg-background">
      <div className="max-w-[1392px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/solar_link-circle-bold.png"
              alt="Devlinks Logo"
              width={36}
              height={36}
            />
            <span className="hidden sm:block text-xl sm:text-2xl font-bold text-foreground">
              Devlinks
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {links.map(({ to, label, icon }) => {
              const isActive = pathname === to;
              return (
                <Link
                  key={to}
                  href={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-[#EFEBFF] text-[#633CFF]"
                      : "text-muted-foreground hover:text-[#633CFF] hover:bg-muted"
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" className={"rounded-[8px] border-[#633CFF] text-[#633CFF] hover:bg-[#EFEBFF]"}>
              <Link href="/preview">Preview</Link>
            </Button>
            <UserMenu />

            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-md border"
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {open && (
          <nav className="md:hidden mt-4 flex flex-col gap-2">
            {links.map(({ to, label, icon }) => {
              const isActive = pathname === to;
              return (
                <Link
                  key={to}
                  href={to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-[#EFEBFF] text-[#633CFF]"
                      : "text-muted-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {icon}
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}