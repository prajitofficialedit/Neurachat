"use client";

import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

type Message = {
  role: "user" | "ai";
  text: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

export default function Home() {
  const [input, setInput] = useState("");

  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      title: "New Chat",
      messages: [],
    },
  ]);

  const [currentChatId, setCurrentChatId] = useState(1);

  const { data: session } = useSession();

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentChat = chats.find(
    (chat) => chat.id === currentChatId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [currentChat?.messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [],
    };

    setChats((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    setInput("");

    const updatedChats: Chat[] = chats.map((chat) => {
      if (chat.id === currentChatId) {
        return {
          ...chat,
          title:
            chat.messages.length === 0
              ? userText.slice(0, 20)
              : chat.title,
          messages: [
            ...chat.messages,
            {
              role: "user" as const,
              text: userText,
            },
          ],
        };
      }

      return chat;
    });

    setChats(updatedChats);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
        }),
      });

      const data = await res.json();

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  role: "ai" as const,
                  text: data.reply,
                },
              ],
            };
          }

          return chat;
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen bg-[#212121] text-white">

      {/* Sidebar */}
      <div className="w-[260px] bg-[#171717] border-r border-[#2a2a2a] flex flex-col">

        {/* Logo */}
        <div className="p-4 text-2xl font-bold border-b border-[#2a2a2a]">
          NeuraChat
        </div>

        {/* New Chat */}
        <div className="p-3">
          <button
            onClick={createNewChat}
            className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] transition p-3 rounded-xl text-left"
          >
            + New Chat
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-3 space-y-2">

          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() =>
                setCurrentChatId(chat.id)
              }
              className={`p-3 rounded-xl cursor-pointer transition ${
                currentChatId === chat.id
                  ? "bg-[#3a3a3a]"
                  : "hover:bg-[#2a2a2a]"
              }`}
            >
              💬 {chat.title}
            </div>
          ))}

        </div>

        {/* Bottom */}
        <div className="p-3 border-t border-[#2a2a2a]">

          <button
            onClick={() =>
              alert("NeuraChat Pro Coming Soon 🚀")
            }
            className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded-xl mb-2"
          >
            Upgrade Plan
          </button>

          {session ? (
            <div className="space-y-2">

              <div className="bg-[#2a2a2a] p-3 rounded-xl">
                👤 {session.user?.name}
              </div>

              <button
                onClick={() => signOut()}
                className="w-full bg-red-600 hover:bg-red-700 transition p-3 rounded-xl"
              >
                Logout
              </button>

            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-xl"
            >
              Sign in with Google
            </button>
          )}

        </div>

      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="h-16 border-b border-[#2a2a2a] flex items-center px-6 text-lg font-semibold">
          NeuraChat AI
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8">

          {currentChat?.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">

              <h1 className="text-5xl font-bold mb-4">
                Welcome to NeuraChat 🤖
              </h1>

              <p className="text-gray-400 text-lg">
                Your intelligent AI assistant
              </p>

            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">

              {currentChat?.messages.map(
                (m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user"
                        ? "flex justify-end"
                        : "flex justify-start"
                    }
                  >
                    <div
                      className={
                        m.role === "user"
                          ? "bg-green-600 px-5 py-4 rounded-3xl max-w-[75%] text-lg"
                          : "bg-[#2a2a2a] px-5 py-4 rounded-3xl max-w-[75%] text-lg"
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                )
              )}

              <div ref={messagesEndRef} />

            </div>
          )}

        </div>

        {/* Input */}
        <div className="p-6 border-t border-[#2a2a2a]">

          <div className="max-w-4xl mx-auto flex items-center bg-[#2a2a2a] rounded-2xl px-4 py-3">

            <input
              type="text"
              placeholder="Message NeuraChat..."
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              className="flex-1 bg-transparent outline-none text-lg"
            />

            <button
              onClick={sendMessage}
              className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded-xl"
            >
              Send
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}