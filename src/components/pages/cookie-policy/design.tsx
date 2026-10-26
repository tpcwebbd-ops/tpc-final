/*
|-----------------------------------------
| setting up design.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import React from "react";

const CookiePolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      {/* Header */}
      <header className="mb-10 border-b pb-6">
        <h1 className="text-4xl font-extrabold mb-4">Cookie Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      {/* Policy Content */}
      <main className="space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Overview</h2>
          <p className="leading-relaxed text-gray-700">
            We want you to be completely satisfied with your purchase. If you are not entirely happy, we are here to
            help.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Returns Eligibility</h2>
          <p className="leading-relaxed text-gray-700 mb-4">To be eligible for a return, please ensure that:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 ml-2">
            <li>The product was purchased within the last 30 days.</li>
            <li>The product is in its original, unused, and undamaged condition.</li>
            <li>You have the receipt or proof of purchase.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Refund Process</h2>
          <p className="leading-relaxed text-gray-700">
            Once we receive your item, we will inspect it and notify you that we have received your returned item. If
            your return is approved, we will initiate a refund to your original method of payment. You will receive the
            credit within a certain amount of days, depending on your card issuer&apos;s policies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Shipping Costs</h2>
          <p className="leading-relaxed text-gray-700">
            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are
            non-refundable.
          </p>
        </section>

        <section className="bg-red-50 p-6 rounded-lg border border-red-100">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Contact Us</h2>
          <p className="text-red-700">
            If you have any questions on how to return your item to us, contact us at:
            <br />
            <a href="mailto:support@yourdomain.com" className="font-bold hover:underline">
              support@yourdomain.com
            </a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default CookiePolicy;
