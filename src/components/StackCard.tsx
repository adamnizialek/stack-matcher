import { StackItem } from "@/lib/openai";

interface Props {
  item: StackItem;
}

export function StackCard({ item }: Props) {
  return (
    <div className="border border-white/10 rounded-xl p-4 bg-white/5 hover:bg-white/10 transition-colors">
      <h3 className="font-semibold text-white mb-1">{item.name}</h3>
      <p className="text-xs text-zinc-500 mb-2">{item.role}</p>
      <p className="text-sm text-zinc-400 leading-relaxed">{item.reason}</p>
    </div>
  );
}
