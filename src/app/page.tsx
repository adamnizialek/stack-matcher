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
      <a href="/feed" className="mt-10 inline-flex items-center gap-2 text-sm px-5 py-2 rounded-full border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all">
        Browse community stacks
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
        </svg>
      </a>
    </main>
  );
}
