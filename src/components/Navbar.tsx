import { auth } from "@/lib/auth";
import Link from "next/link";
import { UserMenu } from "./UserMenu";

export async function Navbar() {
  const session = await auth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-xl border-b border-white/5">
      <div className="w-full pl-2 pr-2 sm:pl-4 sm:pr-4 h-14 sm:h-16 flex items-center justify-between">
        <Link href="/" className="text-base sm:text-lg font-bold text-white tracking-tight ml-2">
          Stack Matcher
        </Link>
        <div className="flex items-center gap-4 sm:gap-8 text-sm sm:text-base mr-2">
          <Link href="/feed" className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all">
            Community
          </Link>
          {session ? (
            session.user?.image ? (
              <UserMenu image={session.user.image} />
            ) : (
              <a
                href="/auth/signout"
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Sign out
              </a>
            )
          ) : (
            <a
              href="/api/auth/signin"
              className="bg-white text-black px-3 py-1 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-zinc-200 transition-colors"
            >
              Sign in
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
