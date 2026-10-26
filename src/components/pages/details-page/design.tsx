/*
|-----------------------------------------
| setting up Design for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: WebApp, June, 2026
|-----------------------------------------
*/

"use client";

import { motion } from "framer-motion";
import { Check, ShoppingCart, Download, Share2 } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function ProductShowcase() {
  const [timeLeft, setTimeLeft] = useState({ hours: 21, minutes: 32, seconds: 2 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    "Lifetime updates",
    "6 months support",
    "Commercial license",
    "Instant download",
    "Full Customizable",
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 grid md:grid-cols-3 gap-8 items-start">
      {/* Left Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="md:col-span-2 bg-white rounded-sm shadow-xl border border-gray-100 p-4 md:p-6"
      >
        <div className="bg-green-800 rounded-sm overflow-hidden mb-6">
          <div
            role="img"
            aria-label="Banner"
            className="h-48 w-full bg-cover bg-center opacity-90 md:h-80"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800")',
            }}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">প্রোডাক্ট ক্যাটাগরি</h2>
        {/* Mock category items could be placed here */}
      </motion.div>

      {/* Right Pricing Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-sm shadow-2xl border border-gray-100 p-6 space-y-6"
      >
        <div>
          <h3 className="text-gray-500 text-lg">Price</h3>
          <p className="text-4xl font-bold text-blue-600">1,750৳</p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 border-t pt-4">Khati Bhaii – Ecommerce Website Template</h2>

        <ul className="space-y-3">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-3 text-gray-600">
              <Check className="text-blue-500 w-5 h-5" /> {f}
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-3 gap-2">
          {Object.entries(timeLeft).map(([key, val]) => (
            <div key={key} className="bg-blue-600 text-white rounded-sm p-2 text-center">
              <div className="text-2xl font-bold">{String(val).padStart(2, "0")}</div>
              <div className="text-[10px] uppercase">{key}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-4 rounded-sm font-bold flex items-center justify-center gap-2">
            <ShoppingCart size={20} /> Buy Now
          </button>
          <button className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white py-4 rounded-sm font-bold flex items-center justify-center gap-2">
            <Download size={20} /> Membership
          </button>
        </div>

        <div className="flex justify-center gap-4 pt-4 border-t">
          {[Share2, Share2, Share2, Share2, Share2].map((Icon, i) => (
            <Icon key={i} className="text-gray-400 hover:text-blue-600 cursor-pointer transition-colors" size={24} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
