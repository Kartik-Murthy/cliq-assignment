import { Button } from "@/components/ui/button";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";

const Header = () => {
  return (
    <div className="sticky top-0 right-0 left-0 z-50 flex items-center justify-between bg-gradient-to-r from-teal-400 to-blue-500 p-2 shadow-lg">
      <Button
        variant="secondary"
        className="flex cursor-pointer items-center space-x-2 transition duration-200 ease-in-out"
      >
        <ArrowLeft size={24} />
        <span className="font-semibold">Back</span>
      </Button>

      <SignedIn>
        <div className="rounded-lg bg-white px-1 py-1">
          <UserButton showName />
        </div>
      </SignedIn>
    </div>
  );
};

export default Header;
