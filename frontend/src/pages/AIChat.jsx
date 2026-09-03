import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import "./AIChat.css";

const API_URL = "https://ai-teacher-backend-gjdi.onrender.com";

function AIChat() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("English");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      text:
        "Hello! 👋 I am your AI Teacher. Enter any topic, subject, programming concept, or question and I will teach you step by step.",
    },
  ]);

  const messagesEndRef = useRef(null);

  /* ===============================
     AUTO SCROLL
  =============================== */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isLoading]);

  /* ===============================
     SEND MESSAGE
  =============================== */

  const sendMessage = async (customMessage = null) => {
    const userMessage = (customMessage || input).trim();

    if (!userMessage || isLoading) {
      return;
    }

    const userChatMessage = {
      id: Date.now(),
      role: "user",
      text: userMessage,
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      userChatMessage,
    ]);

    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/ai/chat`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,
            language: language,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "AI response failed."
        );
      }

      // IMPORTANT:
      // Backend returns:
      // data.response
      // and
      // data.answer

      const aiAnswer =
        data.response ||
        data.answer ||
        data.reply ||
        data.message ||
        "Sorry, I could not generate a response.";

      const aiChatMessage = {
        id: Date.now() + 1,
        role: "ai",
        text: aiAnswer,
      };

      setMessages((previousMessages) => [
        ...previousMessages,
        aiChatMessage,
      ]);

    } catch (error) {

      console.error(
        "AI CHAT ERROR:",
        error
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: Date.now() + 2,
          role: "ai",
          text:
            `⚠️ ${error.message || "Unable to connect to the AI server."}`,
          error: true,
        },
      ]);

    } finally {

      setIsLoading(false);

    }
  };

  /* ===============================
     ENTER KEY
  =============================== */

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }
  };

  /* ===============================
     CLEAR CHAT
  =============================== */

  const clearChat = () => {

    if (isLoading) {
      return;
    }

    setMessages([
      {
        id: Date.now(),
        role: "ai",
        text:
          "Chat cleared! 🧹 What would you like to learn now?",
      },
    ]);
  };

  /* ===============================
     QUICK QUESTIONS
  =============================== */

  const quickQuestions = [
    "Teach me Python from the beginning",
    "Explain Data Structures",
    "What is Artificial Intelligence?",
    "Explain Cloud Computing",
  ];

  return (
    <div className="ai-chat-page">

      <Navbar />

      <main className="ai-chat-main">

        {/* ================= HEADER ================= */}

        <section className="ai-chat-header">

          <div>

            <p className="chat-tag">
              AI POWERED LEARNING
            </p>

            <h1>
              AI Teacher 🤖
            </h1>

            <p className="chat-subtitle">
              Ask anything and learn step by step
              with your personal AI Teacher.
            </p>

          </div>

          {/* LANGUAGE */}

          <div className="chat-language-box">

            <label>
              Teaching Language
            </label>

            <select
              value={language}
              onChange={(event) =>
                setLanguage(
                  event.target.value
                )
              }
            >

              <option value="English">
                English
              </option>

              <option value="Hindi">
                Hindi
              </option>

              <option value="Marathi">
                Marathi
              </option>

            </select>

          </div>

        </section>

        {/* ================= MAIN CHAT ================= */}

        <section className="chat-layout">

          {/* ================= SIDEBAR ================= */}

          <aside className="chat-sidebar">

            <div className="ai-profile">

              <div className="big-ai-avatar">
                🤖
              </div>

              <h2>
                Your AI Teacher
              </h2>

              <p>
                Learn any subject with
                personalized AI explanations.
              </p>

            </div>

            {/* FEATURES */}

            <div className="ai-features">

              <div>
                <span>🧠</span>
                Any Topic
              </div>

              <div>
                <span>📚</span>
                Step-by-Step Learning
              </div>

              <div>
                <span>💡</span>
                Smart Examples
              </div>

              <div>
                <span>💻</span>
                Programming Help
              </div>

            </div>

            {/* QUICK QUESTIONS */}

            <div className="quick-section">

              <h3>
                Try These Topics
              </h3>

              {quickQuestions.map(
                (question, index) => (

                  <button
                    key={index}
                    className="quick-question"
                    onClick={() =>
                      sendMessage(question)
                    }
                    disabled={isLoading}
                  >

                    {question}

                  </button>

                )
              )}

            </div>

          </aside>

          {/* ================= CHAT ================= */}

          <section className="chat-container">

            {/* TOP BAR */}

            <div className="chat-topbar">

              <div className="chat-title">

                <div className="small-ai-avatar">
                  🤖
                </div>

                <div>

                  <h3>
                    AI Teacher
                  </h3>

                  <span>
                    <span className="online-dot" />
                    Online
                  </span>

                </div>

              </div>

              <div className="chat-actions">

                <button
                  onClick={clearChat}
                  disabled={isLoading}
                  title="Clear Chat"
                >
                  🗑️ Clear
                </button>

              </div>

            </div>

            {/* MESSAGES */}

            <div className="messages-area">

              {messages.map(
                (message) => (

                  <div
                    className={`message-row ${message.role}`}
                    key={message.id}
                  >

                    {message.role === "ai" && (

                      <div className="message-avatar">
                        🤖
                      </div>

                    )}

                    <div
                      className={`message-bubble ${
                        message.error
                          ? "error-message"
                          : ""
                      }`}
                    >

                      {message.text}

                    </div>

                    {message.role === "user" && (

                      <div className="message-avatar user-avatar">
                        👤
                      </div>

                    )}

                  </div>

                )
              )}

              {/* LOADING */}

              {isLoading && (

                <div className="message-row ai">

                  <div className="message-avatar">
                    🤖
                  </div>

                  <div className="message-bubble typing-bubble">

                    <span />
                    <span />
                    <span />

                  </div>

                </div>

              )}

              <div
                ref={messagesEndRef}
              />

            </div>

            {/* INPUT */}

            <div className="chat-input-area">

              <input
                type="text"

                value={input}

                onChange={(event) =>
                  setInput(
                    event.target.value
                  )
                }

                onKeyDown={
                  handleKeyDown
                }

                placeholder="Enter any topic or ask any question..."

                disabled={isLoading}
              />

              <button
                onClick={() =>
                  sendMessage()
                }

                disabled={
                  isLoading ||
                  !input.trim()
                }
              >

                {isLoading
                  ? "Thinking..."
                  : "Send →"}

              </button>

            </div>

          </section>

        </section>

      </main>

    </div>
  );
}

export default AIChat;