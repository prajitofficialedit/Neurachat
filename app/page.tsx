"use client";

import { useState } from "react";

type Message = {
  role: "user" | "ai";
  text: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      const data = await res.json();

      const aiMessage: Message = {
        role: "ai",
        text: data.reply || "No response",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Error getting response",
        },
      ]);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6">NeuraChat</h1>

        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xl ${
                msg.role === "user"
                  ? "bg-green-600 ml-auto"
                  : "bg-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-800 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message NeuraChat..."
          className="flex-1 p-3 rounded-lg bg-gray-900 border border-gray-700 outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 px-6 rounded-lg"
        >
          Send
        </button>
      </div>
    </main>
  );
}