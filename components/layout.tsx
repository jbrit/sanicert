import Image from "next/image";
import localFont from "next/font/local";

import { Toaster } from "@/components/ui/toaster";
import React from "react";
import Link from "next/link";

const geistSans = localFont({
  src: "../pages/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../pages/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        className={`${geistSans.variable} ${geistMono.variable} grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]`}
      >
        <nav className="font-[family-name:var(--font-geist-mono)] font-semibold italic text-xl flex items-center">
          <Link href="/#"><span className="mr-2 -mt-1 border-b border-green-300 inline-block">
            SANICERT
          </span>
          <span>&#x2705;</span></Link>
        </nav>
        {children}
        <Toaster />
        <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="https://nextjs.org/icons/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            How It Works
          </a>
          <a
            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
            href="https://github.com/jbrit/sanicert"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="https://nextjs.org/icons/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Github →
          </a>
        </footer>
      </div>
    </>
  );
}
