"use client";

import { signOut } from "next-auth/react";

export default function SignOutPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
      <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl shadow-black/40">
        <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-zinc-400">
            <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
            <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
          </svg>
        </div>
        <h1 className="text-xl font-semibold mb-2">Sign out</h1>
        <p className="text-zinc-400 text-sm mb-6">Are you sure you want to sign out?</p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full bg-white text-black py-2 rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            Sign out
          </button>
          <a
            href="/"
            className="w-full inline-block py-2 rounded-full text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-colors"
          >
            Cancel
          </a>
        </div>
      </div>
    </main>
  );
}
