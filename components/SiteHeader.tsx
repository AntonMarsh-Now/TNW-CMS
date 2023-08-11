"use client";

import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { ModeToggle } from "@/components/ModeToggle";
import SignOutButton from "./SignOutButton";

export function SiteHeader() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-5">
            <ModeToggle />
            <SignOutButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
