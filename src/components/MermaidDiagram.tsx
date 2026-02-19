"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  chart: string;
}

export function MermaidDiagram({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ref.current || !chart) return;

    let cancelled = false;

    async function render() {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          primaryColor: "#4f46e5",
          primaryTextColor: "#fff",
          primaryBorderColor: "#6366f1",
          lineColor: "#a5b4fc",
          secondaryColor: "#27272a",
          tertiaryColor: "#18181b",
          background: "#09090b",
          mainBkg: "#27272a",
          nodeBorder: "#6366f1",
          clusterBkg: "#18181b",
          titleColor: "#fff",
          edgeLabelBackground: "#18181b",
        },
      });

      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, chart);
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    render();
    return () => { cancelled = true; };
  }, [chart]);

  if (error || !chart) return null;

  return (
    <div className="mt-6 border border-zinc-800 rounded-xl p-4 bg-zinc-950 overflow-x-auto">
      <p className="text-xs text-zinc-500 mb-3">Architecture Diagram</p>
      <div ref={ref} className="flex justify-center" />
    </div>
  );
}
