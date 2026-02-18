import { RecommendForm } from "@/components/RecommendForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center px-4 pt-20 pb-16">
      <h1 className="text-4xl font-bold mb-3 tracking-tight">Stack Matcher</h1>
      <p className="text-zinc-400 text-center mb-10 max-w-md">
        Describe your project. Get the perfect tech stack — recommended by AI, validated by developers.
      </p>
      <RecommendForm />
      <a href="/feed" className="mt-12 text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
        Browse community stacks →
      </a>
    </main>
  );
}
