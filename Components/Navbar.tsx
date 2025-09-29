import Image from "next/image";
import React from "react";

export const Navbar = () => {
  const navLinks = (
    <>
      <ul className="flex gap-4 text-accent">
        <li>Home</li>
        <li>Streak</li>
        <li>Notification</li>
        <li>AI Coach</li>
        <li>About Us</li>
        <li>Blog</li>
      </ul>
    </>
  );
  return (
    <div className="navbar bg-transparent backdrop-blur-md py-6 fixed z-50 px-8 lg:px-24   ">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
          {
            navLinks
          }
          </ul>
        </div>
       <div className="flex items-center justify-center">
        <Image src='/images/SleepSync.png' alt="sleepSync-logo" width={52} height={52}></Image>
       <h1 className="text-2xl font-bold  text-accent">SleepSync</h1>

       </div>
      </div>
      <div className="navbar-center hidden lg:flex">
           {
            navLinks
          }
      </div>
      <div className="navbar-end">
       <button className='btn  text-accent bg-gradient-to-l from-secondary to-primary rounded-full'>
        Login
       </button>
      </div>
    </div>
  );
};
