import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Inter } from "next/font/google";
import Nav from "./nav";
import { useState } from "react";
import Logo from "./logo";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  if (!session)
    return (
      <div className={"bg-gray-200 w-screen h-screen flex items-center"}>
        <div className="text-center w-full">
          {" "}
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  return (
    <div className="bg-gray-200 min-h-screen">
      {!showNav && (
        <div className="flex items-center md:hidden p-4">
          <button
            onClick={() => {
              setShowNav((show) => !show); // Toggle show
              console.log(showNav);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </button>
          <div className="flex grow justify-center mr-6">
            <Logo />
          </div>
        </div>
      )}
      <div className="flex">
        <Nav showNav={showNav} />
        <div className="bg-white flex-grow  p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
