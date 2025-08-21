"use client";
import React, { useState } from "react";

export function scoreCopy(text: string) {
  let s = 50;
  if (text.length < 30) s -= 5;
  if (text.length > 90) s -= 10;
  if (/free|now|instant/i.test(text)) s += 10;
  if (/[!?.]$/.test(text)) s += 3;
  return Math.max(0, Math.min(100, s));
}

type Variation = { text: string; score?: number };

export default function CTAEditor() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [variations, setVariations] = useState<Variation[]>([]);

  async function generate() {
    if (!input.trim()) return;
    setLoading(true);
    setVariations([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, tone, length }),
      });

      console.log("API Response status:", res.status);
      const data = await res.json();
      console.log("API Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const variations: Variation[] = (data.variations || []).map(
        (t: string) => ({
          text: t.replace(/\*+/g, "").trim(),
          score: scoreCopy(t),
        })
      );

      console.log("Processed variations:", variations);
      setVariations(variations);

      if (data.isMock) {
        alert(
          `🤗 ${data.message}\n\nTo use FREE AI generation, get a Hugging Face API token:\n1. Go to https://huggingface.co/settings/tokens\n2. Create a new token\n3. Add it to your .env.local file`
        );
      } else {
        console.log(`✅ Generated with ${data.provider}: ${data.message}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error generating copy. Check server logs and your API key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Input Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Input */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What would you like to optimize?
            </label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none text-gray-900 placeholder-gray-500"
              rows={4}
              placeholder="Enter your product headline, feature description, or marketing copy that you'd like to improve..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {/* Tone Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tone of Voice
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Persuasive</option>
                <option>Urgent</option>
                <option>Casual</option>
              </select>
            </div>

            {/* Length Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Content Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["short", "medium", "long"].map((len) => (
                  <button
                    key={len}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                      length === len
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setLength(len)}
                  >
                    {len.charAt(0).toUpperCase() + len.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={generate}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Generating...
                </span>
              ) : (
                "Generate Content"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {variations.length > 0 && (
        <div className="p-6 fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Variations
            </h3>
            <span className="text-sm text-gray-500">
              {variations.length} result{variations.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {variations.map((v, i) => (
              <div
                key={i}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    Option {i + 1}
                  </span>
                  <div className="flex items-center space-x-1">
                    <svg
                      className="w-4 h-4 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      {v.score}
                    </span>
                  </div>
                </div>

                <p className="text-gray-900 font-medium leading-relaxed mb-4 min-h-[3rem]">
                  {v.text}
                </p>

                <button
                  className="w-full bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    navigator.clipboard.writeText(v.text);
                    // Could add a toast notification here instead of alert
                    const btn = document.activeElement as HTMLButtonElement;
                    const originalText = btn.textContent;
                    btn.textContent = "Copied!";
                    setTimeout(() => {
                      btn.textContent = originalText;
                    }, 1000);
                  }}
                >
                  Copy to Clipboard
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
