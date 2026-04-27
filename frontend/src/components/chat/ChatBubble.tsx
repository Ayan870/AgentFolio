import { Message } from "@/types";
import { clsx } from "clsx";

export default function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={clsx("flex w-full mb-4", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-1">
          AI
        </div>
      )}
      <div className="max-w-[75%]">
        <div
          className={clsx(
            "px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-indigo-600 text-white rounded-br-sm"
              : "bg-gray-800 text-gray-100 rounded-bl-sm"
          )}
        >
          {message.content}
        </div>
        {message.sources && message.sources.length > 0 && (
          <div className="mt-1 flex gap-2 flex-wrap">
            {message.sources.map((s) => (
              <span
                key={s}
                className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full border border-gray-700"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}