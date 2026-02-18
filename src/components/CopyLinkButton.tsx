"use client";

import { useState } from "react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="text-sm text-zinc-400 hover:text-white transition-colors"
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
