import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix Vite Next UI!",
    },
  ];
};

export default function Index() {
  return (
    <main className="max-w-5xl mx-auto px-6">
      <h1 className="text-4xl font-bold text-center mt-8">
        Welcome to Remix Vite Next UI!
      </h1>
      <p className="text-center mt-4">
        This is a new Remix app using Vite and Next UI.
      </p>
    </main>
  );
}
