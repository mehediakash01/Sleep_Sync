"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaFacebookF, FaTwitter, FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const toastId = toast.loading("Creating account...");

    try {
      const res = await axios.post("/api/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success(res.data.message || "Account created successfully!", {
        id: toastId,
      });

      setForm({ name: "", email: "", password: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Request failed", {
        id: toastId,
      });
    }
  };

  return (
    <div className="flex lg:flex-row flex-col items-center justify-center min-h-screen bg-gray-100 py-20">
      <div className="bg-white w-[900px] rounded-2xl shadow-lg overflow-hidden flex">
        {/* Left Image Section */}
        <div className="w-1/2 bg-gradient-to-tl from-secondary to-primary flex flex-col items-center justify-center p-8 text-white relative">
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

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="mb-4">
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-white bg-black hover:bg-gray-800 transition"
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
