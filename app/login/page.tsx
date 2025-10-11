"use client";

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    // Show loading toast
    const toastId = toast.loading("Signing in...");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    toast.dismiss(toastId); 

    if (res?.ok) {
      toast.success("Login successful!");
      router.push("/");
    } else {
      toast.error(res?.error || "Invalid credentials");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-36">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row w-full max-w-5xl">

        {/* Left Form Section */}
        <div className="w-full lg:w-1/2 p-8 sm:p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-6 text-center lg:text-left">SIGN IN</h2>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-between items-center mb-6 text-sm">
              <a href="#" className="text-gray-500 hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
            >
              LOGIN
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="px-4 text-sm text-gray-500 whitespace-nowrap">
              OR YOU CAN JOIN WITH
            </span>
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

        {/* Right Image Section */}
        <div className="w-full lg:w-1/2 bg-gradient-to-tl from-secondary to-primary flex flex-col items-center justify-center p-8 text-white text-center lg:text-left">
          <h2 className="text-xl font-semibold mb-2">HELLO,</h2>
          <h1 className="text-3xl font-bold mb-6">WELCOME BACK</h1>

          <Image
            src="/images/loginImg.png"
            alt="Login Illustration"
            width={300}
            height={300}
            className="mb-6 w-60 sm:w-72 lg:w-[350px] h-auto"
            priority
          />

          <p className="mt-4 text-sm">
            Don’t have an account yet?{" "}
            <Link href="/register" className="underline font-semibold">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
