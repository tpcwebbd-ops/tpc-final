/*
|-----------------------------------------
| setting up design.tsx for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 26 October, 2026
|-----------------------------------------
*/

export default function CookiePolicy() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12 text-gray-800">
      <header className="mb-10 border-b pb-6">
        <h1 className="mb-4 text-4xl font-extrabold">Cookie Policy</h1>
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
      </header>
      <div className="space-y-8">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">1. What cookies are</h2>
          <p className="leading-relaxed text-gray-700">
            Cookies are small text files stored on your device when you visit a website. They can help a site remember
            basic settings and support its features.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-semibold">2. How this site uses cookies</h2>
          <p className="mb-3 leading-relaxed text-gray-700">This site may use cookies to:</p>
          <ul className="ml-2 list-inside list-disc space-y-2 text-gray-700">
            <li>Keep essential features working.</li>
            <li>Remember relevant preferences where available.</li>
            <li>Understand site usage when analytics are enabled.</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-semibold">3. Managing cookies</h2>
          <p className="leading-relaxed text-gray-700">
            Most browsers let you control or delete cookies in their settings. Blocking some cookies may affect how
            parts of the site work.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-2xl font-semibold">4. Questions</h2>
          <p className="leading-relaxed text-gray-700">
            Contact the site team if you have questions about this policy or how cookies are used.
          </p>
        </section>
      </div>
    </main>
  );
}
