import { useNavigate } from "react-router-dom";

function AICard() {
  const navigate = useNavigate();

  return (
    <div className="ai-assistant-card">
      <div className="ai-card-glow"></div>

      <div className="ai-card-content">
        <div className="ai-card-top">
          <div className="ai-card-avatar">🤖</div>

          <div>
            <p className="ai-card-label">YOUR PERSONAL ASSISTANT</p>
            <h2>AI Teacher</h2>

            <div className="ai-online-status">
              <span></span>
              Online and ready to help
            </div>
          </div>
        </div>

        <div className="ai-card-message">
          <span>✨</span>
          <p>
            Ready to continue your learning journey? Ask me anything and
            I'll help you understand it step by step.
          </p>
        </div>

        <div className="ai-suggestions">
          <button>Explain a topic</button>
          <button>Create a quiz</button>
          <button>Make study plan</button>
        </div>

        <button
          className="ai-chat-button"
          onClick={() => navigate("/ai-teacher")}
        >
          Open AI Teacher <span>→</span>
        </button>
      </div>
    </div>
  );
}

export default AICard;