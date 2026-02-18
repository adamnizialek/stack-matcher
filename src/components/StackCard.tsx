import { StackItem } from "@/lib/openai";

interface Props {
  item: StackItem;
}

export function StackCard({ item }: Props) {
  return (
    <div className="border border-zinc-700 rounded-lg p-4 bg-zinc-900">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-white">{item.name}</h3>
        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
          {item.role}
        </span>
      </div>
      <p className="text-sm text-zinc-400">{item.reason}</p>
    </div>
  );
}
