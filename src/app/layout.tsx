import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import Header from "@/components/layout/header";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Cliq AI Assignment",
  description: "Cliq AI Assignment",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} scrollbar-hidden`}>
        <body>
          <TRPCReactProvider>
            <Header />
            {children}
            <Toaster richColors />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
