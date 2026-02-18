import { auth } from "@/lib/auth";
import Link from "next/link";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-white tracking-tight">
          Stack Matcher
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/feed" className="text-zinc-400 hover:text-white transition-colors">
            Feed
          </Link>
          {session ? (
            <div className="flex items-center gap-2">
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="avatar"
                  className="w-7 h-7 rounded-full"
                />
              )}
              <a
                href="/api/auth/signout"
                className="text-zinc-500 hover:text-zinc-300 text-xs"
              >
                Sign out
              </a>
            </div>
          ) : (
            <a
              href="/api/auth/signin"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              Sign in with GitHub
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
