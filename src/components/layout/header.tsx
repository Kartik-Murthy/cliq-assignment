"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";

const Header = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="sticky top-0 right-0 left-0 z-50 flex h-14 items-center justify-end bg-gradient-to-r from-teal-400 to-blue-500 p-4 shadow-lg">
      {isMounted && (
        <SignedIn>
          <div className="rounded-lg bg-white px-1 py-1">
            <UserButton showName />
          </div>
        </SignedIn>
      )}
    </div>
  );
};

export default Header;
