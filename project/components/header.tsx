// components/header.tsx
"use client";

import Link from "next/link";
import { Moon, Sun, Shield } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

import { useTheme } from "./theme-provider";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { isSignedIn } = useAuth();

  return (
    <header className="relative z-30 border-b-2 border-amber-950/60 bg-linear-to-b from-[#211610] via-[#1a120d] to-[#120a05] text-amber-100 shadow-[0_10px_30px_rgba(0,0,0,0.8)] font-serif">
      {/* Top Gold Accent Line */}
      <div className="absolute top-0 inset-x-0 h-0.5 bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Branding Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-600/60 bg-linear-to-br from-amber-900 to-amber-950 shadow-md">
              <Shield className="h-5 w-5 text-amber-400" />
            </div>
            <Link
              href="/"
              className="bg-linear-to-b from-amber-100 via-amber-200 to-amber-500 bg-clip-text text-xl font-black tracking-[0.2em] text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            >
              THE ROUNDTABLE
            </Link>
          </div>

          {/* Controls & Navigation */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-xs border border-amber-950/60 bg-[#0d0704] p-2 text-amber-400 hover:text-amber-200 hover:border-amber-500/50 transition-colors shadow-inner cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-amber-300 hover:text-amber-100 transition-colors cursor-pointer"
                  >
                    Enter Gate
                  </button>
                </SignInButton>

                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="rounded-xs border border-amber-500/40 bg-linear-to-b from-[#4e2a14] via-[#2d180b] to-[#1a0e06] px-4 py-2 font-sans text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 hover:text-amber-200 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all cursor-pointer shadow-md"
                  >
                    Join Guild
                  </button>
                </SignUpButton>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="rounded-xs border border-amber-500/40 bg-linear-to-b from-[#4e2a14] via-[#2d180b] to-[#1a0e06] px-4 py-2 font-sans text-xs font-extrabold uppercase tracking-[0.2em] text-amber-400 hover:text-amber-200 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all shadow-md"
                >
                  Dashboard
                </Link>

                <UserButton userProfileMode="modal" />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}