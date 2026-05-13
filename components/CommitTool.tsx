"use client";

import { useState, useEffect, useCallback } from "react";

const DAILY_FREE_LIMIT = 3;
const STORAGE_KEY = "commitcraft_usage";

interface UsageRecord {
  date: string;
  count: number;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function getUsage(): UsageRecord {
  if (typeof window === "undefined") return { date: getTodayKey(), count: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: getTodayKey(), count: 0 };
    const parsed: UsageRecord = JSON.parse(raw);
    if (parsed.date !== getTodayKey()) return { date: getTodayKey(), count: 0 };
    return parsed;
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
}

function incrementUsage(): UsageRecord {
  const current = getUsage();
  const next = { date: current.date, count: current.count + 1 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

const TYPE_COLORS: Record<string, string> = {
  feat:     "bg-green-900/60 text-green-300 border-green-700",
  fix:      "bg-red-900/60 text-red-300 border-red-700",
  refactor: "bg-blue-900/60 text-blue-300 border-blue-700",
  docs:     "bg-yellow-900/60 text-yellow-300 border-yellow-700",
  chore:    "bg-gray-700/60 text-gray-300 border-gray-600",
  style:    "bg-purple-900/60 text-purple-300 border-purple-700",
  test:     "bg-cyan-900/60 text-cyan-300 border-cyan-700",
  perf:     "bg-orange-900/60 text-orange-300 border-orange-700",
  ci:       "bg-pink-900/60 text-pink-300 border-pink-700",
  build:    "bg-indigo-900/60 text-indigo-300 border-indigo-700",
};

function parseType(msg: string): string {
  const m = msg.match(/^([a-z]+)[\((:]/);
  return m ? m[1] : "chore";
}

function TypeBadge({ type }: { type: string }) {
  const cls = TYPE_COLORS[type] ?? TYPE_COLORS["chore"];
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded border text-xs font-mono font-semibold ${cls}`}
    >
      {type}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium
        bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors shrink-0"
      aria-label="Copy commit message"
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function CommitTool() {
  const [diff, setDiff] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usage, setUsage] = useState<UsageRecord>({ date: getTodayKey(), count: 0 });

  useEffect(() => {
    setUsage(getUsage());
  }, []);

  const remaining = Math.max(0, DAILY_FREE_LIMIT - usage.count);
  const isLimitReached = remaining === 0;

  async function handleGenerate() {
    if (!diff.trim()) {
      setError("Please paste a git diff first.");
      return;
    }
    if (isLimitReached) return;

    setLoading(true);
    setError("");
    setMessages([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diff }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed.");
      setMessages(data.messages);
      const next = incrementUsage();
      setUsage(next);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="tool" className="w-full max-w-3xl mx-auto px-4">
      {/* Usage counter */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-400">
          {isLimitReached ? (
            <span className="text-amber-400 font-medium">Daily free limit reached (3/3)</span>
          ) : (
            <>
              Free uses today:{" "}
              <span className="text-white font-semibold">
                {usage.count}/{DAILY_FREE_LIMIT}
              </span>
            </>
          )}
        </p>
        {isLimitReached && (
          <a
            href="#pricing"
            className="text-sm font-medium text-green-400 hover:text-green-300 underline underline-offset-2"
          >
            Upgrade for unlimited →
          </a>
        )}
      </div>

      {/* Diff textarea */}
      <div className="relative">
        <textarea
          value={diff}
          onChange={(e) => setDiff(e.target.value)}
          placeholder={`Paste your git diff here…\n\nExample:\n  diff --git a/src/auth.ts b/src/auth.ts\n  +++ b/src/auth.ts\n  + export async function loginWithGoogle() { … }`}
          className="w-full h-56 bg-gray-900 border border-gray-700 rounded-xl p-4
            font-mono text-sm text-gray-200 placeholder-gray-600
            focus:outline-none focus:ring-2 focus:ring-green-500/60 resize-y
            transition-colors"
          spellCheck={false}
        />
        {diff && (
          <button
            onClick={() => { setDiff(""); setMessages([]); setError(""); }}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Clear"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={loading || isLimitReached || !diff.trim()}
        className="mt-4 w-full py-3 rounded-xl font-semibold text-base
          bg-green-500 hover:bg-green-400 text-gray-950
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all active:scale-[0.98] shadow-lg shadow-green-900/30"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating…
          </span>
        ) : isLimitReached ? (
          "Daily limit reached — Upgrade to continue"
        ) : (
          "Generate Commit Messages"
        )}
      </button>

      {/* Error */}
      {error && (
        <p className="mt-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      {/* Results */}
      {messages.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
            Suggested messages
          </p>
          {messages.map((msg, i) => {
            const type = parseType(msg);
            return (
              <div
                key={i}
                className="flex items-center gap-3 bg-gray-900 border border-gray-700
                  rounded-xl px-4 py-3 group hover:border-gray-600 transition-colors"
              >
                <TypeBadge type={type} />
                <span className="font-mono text-sm text-gray-100 flex-1 break-all">
                  {msg}
                </span>
                <CopyButton text={msg} />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
