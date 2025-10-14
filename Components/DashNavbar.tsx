"use client";
import { Menu } from "lucide-react";
import Image from "next/image";

export default function DashNavbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="flex items-center justify-between bg-white px-4 py-3 shadow-md">
      <button className="lg:hidden" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>
      <h1 className="text-lg font-semibold">Dashboard Overview</h1>
      <div className="flex items-center gap-3">
        {/* <Image
          src="https://i.ibb.co/4Y4Cz5p/user-avatar.png"
          width={35}
          height={35}
          alt="User"
          className="rounded-full"
        /> */}
        <span className="hidden sm:block font-medium">Akash</span>
      </div>
    </header>
  );
}
