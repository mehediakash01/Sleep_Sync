"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";

export default function RegisterPage() {
  return (
    <div className="flex lg:flex-row flex-col items-center justify-center min-h-screen bg-gray-100 py-20">
      <div className="bg-white w-[900px] rounded-2xl shadow-lg overflow-hidden flex">
        {/* Left Image Section */}
        <div className="w-1/2 bg-gradient-to-b from-blue-500 to-blue-700 flex flex-col items-center justify-center p-8 text-white relative">
          <h2 className="text-xl font-semibold mb-2">WELCOME TO</h2>
          <h1 className="text-3xl font-bold mb-6">SleepSync</h1>

          <Image
            src="/images/register-illustration.png"
            alt="Register Illustration"
            width={350}
            height={350}
            className="mb-6"
            priority
          />

          <p className="mt-4 text-sm">
            Already have an account?
            <Link href="/login" className="underline font-semibold">
              Login
            </Link>
          </p>
        </div>

        {/* Right Form Section */}
        <div className="w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6">CREATE ACCOUNT</h2>

          <form>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              REGISTER
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">OR SIGN UP WITH</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center gap-4">
            <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <FaFacebookF />
            </button>
            <button className="w-10 h-10 rounded-full bg-sky-400 text-white flex items-center justify-center">
              <FaTwitter />
            </button>
            <button className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">
              <FaGoogle />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
