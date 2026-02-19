import { RecommendForm } from "@/components/RecommendForm";

export default function Home() {
  return (
    <main className="hero-gradient min-h-screen text-white flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-16 pb-16 sm:pb-20">
      <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-3 sm:mb-4">
          Match your Stack
        </h1>
        <p className="text-zinc-400 text-base sm:text-lg max-w-lg px-2">
          Describe your project, get the perfect tech stack — recommended by AI, validated by developers.
        </p>
      </div>
      <RecommendForm />
      <a href="/feed" className="mt-10 text-zinc-500 hover:text-zinc-300 text-sm transition-colors">
        Browse community stacks →
      </a>
    </main>
  );
}
