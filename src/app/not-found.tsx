//Generated by GeneratePageFile
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "404 | Resource not found",
};

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col flex-1 w-full max-w-screen-lg px-4 mx-auto text-sm md:px-0">
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
};

export default NotFound;
