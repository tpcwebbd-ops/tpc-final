/*
|-----------------------------------------
| setting up design.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 24 August, 2026
|-----------------------------------------
*/

import React from "react";

const DeliveryPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-gray-800">
      {/* Header */}
      <header className="mb-10 border-b pb-6">
        <h1 className="text-4xl font-extrabold mb-4">Delivery Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>

      {/* Policy Content */}
      <main className="space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Shipping Destinations</h2>
          <p className="leading-relaxed text-gray-700">
            We currently deliver to [Region/Countries]. Please ensure your shipping address is correct at checkout to
            avoid delays.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Processing & Delivery Time</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>
              <strong>Processing:</strong> Orders are typically processed within 1-2 business days.
            </li>
            <li>
              <strong>Standard Shipping:</strong> 5-7 business days.
            </li>
            <li>
              <strong>Express Shipping:</strong> 1-2 business days.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Shipping Rates</h2>
          <p className="leading-relaxed text-gray-700">
            Shipping costs are calculated at checkout based on your location and the weight of your order. Free shipping
            is available for orders over [Amount].
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Order Tracking</h2>
          <p className="leading-relaxed text-gray-700">
            Once your order has shipped, you will receive a confirmation email with a tracking number to monitor your
            shipment status.
          </p>
        </section>

        <section className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-2xl font-semibold mb-3">Need Help?</h2>
          <p className="leading-relaxed text-gray-700">
            If you have any questions regarding your delivery or if your order hasn&apos;t arrived within the expected
            timeframe, please reach out to us at:
            <br />
            <a href="mailto:support@yourdomain.com" className="text-blue-600 font-medium hover:underline">
              support@yourdomain.com
            </a>
          </p>
        </section>
      </main>
    </div>
  );
};

export default DeliveryPolicy;
