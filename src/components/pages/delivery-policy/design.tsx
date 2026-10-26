/*
|-----------------------------------------
| setting up design.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 October, 2026
|-----------------------------------------
*/

export default function DeliveryPolicy() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-gray-800">
      <header className="mb-10 border-b pb-6">
        <h1 className="mb-4 text-4xl font-extrabold">Service Delivery Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">1. Service area</h2>
          <p className="leading-relaxed text-gray-700">
            Contact the team to confirm that support is available for your project or request.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-semibold">2. Planning and delivery time</h2>
          <ul className="list-inside list-disc space-y-2 text-gray-700">
            <li>Initial requests are usually reviewed within 1-2 business days.</li>
            <li>Project timelines are confirmed in the approved proposal.</li>
            <li>Updates are shared at the milestones agreed for the work.</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-semibold">3. Delivery format</h2>
          <p className="leading-relaxed text-gray-700">
            Project deliverables are provided in the format agreed with you. Any additional costs are documented in the
            applicable proposal or agreement.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-semibold">4. Project updates</h2>
          <p className="leading-relaxed text-gray-700">
            Progress updates are shared through the agreed contact channel so you can follow the work and next steps.
          </p>
        </section>
        <section className="rounded-lg border bg-gray-50 p-6">
          <h2 className="mb-3 text-2xl font-semibold">Need help?</h2>
          <p className="leading-relaxed text-gray-700">
            If you have questions about a project or its agreed timeline, contact the site team.
          </p>
        </section>
      </div>
    </main>
  );
}
