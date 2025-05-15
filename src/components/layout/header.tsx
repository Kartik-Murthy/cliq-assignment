import { SignedIn, UserButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <div className="sticky top-0 right-0 left-0 z-50 flex items-center justify-end bg-gradient-to-r from-teal-400 to-blue-500 p-2 shadow-lg">
      <SignedIn>
        <div className="rounded-lg bg-white px-1 py-1">
          <UserButton showName />
        </div>
      </SignedIn>
    </div>
  );
};

export default Header;
