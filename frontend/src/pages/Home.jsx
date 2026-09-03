import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🧠",
      title: "Personalized Learning",
      text: "AI adapts lessons according to your learning level and goals.",
    },
    {
      icon: "⚡",
      title: "Learn Faster",
      text: "Get clear explanations and smart learning paths instantly.",
    },
    {
      icon: "🎯",
      title: "Adaptive Learning",
      text: "Your learning experience improves based on your progress.",
    },
    {
      icon: "📊",
      title: "Track Progress",
      text: "Monitor your performance and improve every day.",
    },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* HERO */}
      <section className="home-hero" id="home">
        <div className="home-glow glow-one"></div>
        <div className="home-glow glow-two"></div>

        <div className="hero-content">
          <div className="hero-left-content">
            <div className="hero-badge">
              ✨ NEXT GENERATION AI LEARNING
            </div>

            <h1>
              Learn Smarter.
              <br />
              <span>Grow Faster.</span>
              <br />
              With AI.
            </h1>

            <p>
              Your personal AI-powered learning companion that understands
              your goals, adapts to your learning level, and helps you learn
              better every day.
            </p>

            <div className="hero-actions">
              <button
                className="hero-primary-btn"
                onClick={() => navigate("/login")}
              >
                Start Learning <span>→</span>
              </button>

              <button
                className="hero-secondary-btn"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <span>▶</span> See How It Works
              </button>
            </div>

            <div className="hero-stats">
              <div>
                <strong>10K+</strong>
                <span>Active Learners</span>
              </div>

              <div className="stats-divider"></div>

              <div>
                <strong>95%</strong>
                <span>Learning Progress</span>
              </div>

              <div className="stats-divider"></div>

              <div>
                <strong>24/7</strong>
                <span>AI Support</span>
              </div>
            </div>
          </div>

          {/* AI PREVIEW */}
          <div className="hero-ai-preview">
            <div className="floating-tag tag-top">
              🧠 AI Personalized
            </div>

            <div className="ai-preview-card">
              <div className="preview-header">
                <div className="preview-avatar">🤖</div>

                <div>
                  <h3>AI Teacher</h3>
                  <p>
                    <span className="online-indicator"></span>
                    Online & ready to help
                  </p>
                </div>

                <div className="preview-status">LIVE</div>
              </div>

              <div className="preview-divider"></div>

              <div className="chat user-chat">
                Explain Artificial Intelligence
              </div>

              <div className="chat ai-chat">
                <span>🤖</span>

                <div>
                  <strong>Absolutely!</strong>

                  <p>
                    Artificial Intelligence is technology that enables
                    machines to learn and solve problems intelligently.
                  </p>
                </div>
              </div>

              <div className="mini-learning-card">
                <div className="mini-card-top">
                  <span>📚 Today's Learning</span>
                  <strong>68%</strong>
                </div>

                <div className="mini-progress">
                  <div className="mini-progress-fill"></div>
                </div>

                <p>Keep going! You are making great progress.</p>
              </div>
            </div>

            <div className="floating-tag tag-right">
              ⚡ Learn Faster
            </div>

            <div className="floating-tag tag-bottom">
              🎯 Adaptive Learning
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="section-tag">POWERED BY AI</span>

          <h2>
            Everything you need to
            <span> learn better.</span>
          </h2>

          <p>
            A complete AI-powered learning platform designed to help you
            understand, practice, and grow.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>

              <div className="feature-arrow">→</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="section-heading">
          <span className="section-tag">SIMPLE PROCESS</span>

          <h2>
            Learning with AI is
            <span> simple.</span>
          </h2>
        </div>

        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon">📚</div>

            <h3>Choose a Topic</h3>

            <p>
              Tell the AI Teacher what subject or topic you want to learn.
            </p>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon">🧠</div>

            <h3>AI Understands You</h3>

            <p>
              The AI understands your learning level, language and goals.
            </p>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon">✨</div>

            <h3>Get Your Learning Path</h3>

            <p>
              Receive personalized lessons, examples and learning activities.
            </p>
          </div>

          <div className="step-connector">→</div>

          <div className="step-card">
            <div className="step-number">04</div>
            <div className="step-icon">🚀</div>

            <h3>Start Learning</h3>

            <p>
              Learn at your own pace and track your progress every day.
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <div className="about-ai-visual">
          <div className="about-circle"></div>

          <div className="about-robot">🤖</div>

          <div className="about-floating-card">
            <span>✨</span>
            AI Powered Learning
          </div>
        </div>

        <div className="about-content">
          <span className="section-tag">ABOUT AI TEACHER</span>

          <h2>
            Your learning journey,
            <span> powered by intelligence.</span>
          </h2>

          <p>
            AI Teacher is designed to make learning more personalized,
            interactive and accessible. Instead of one learning method for
            everyone, our AI adapts to the individual learner.
          </p>

          <div className="about-points">
            <div>✓ Personalized learning experience</div>
            <div>✓ Multiple language support</div>
            <div>✓ AI-generated explanations</div>
            <div>✓ Progress tracking and recommendations</div>
          </div>

          <button
            className="hero-primary-btn"
            onClick={() => navigate("/login")}
          >
            Begin Your Journey →
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <div>
          <span>READY TO START?</span>

          <h2>
            Your AI learning journey
            <br />
            starts today.
          </h2>

          <p>
            Join AI Teacher and experience a smarter way to learn.
          </p>

          <button onClick={() => navigate("/login")}>
            Start Learning Now →
          </button>
        </div>

        <div className="cta-robot">🤖</div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-brand">
          <div className="footer-logo">AI</div>
          <span>AI Teacher</span>
        </div>

        <div className="footer-center">
          <p>© 2026 AI Teacher. Smart learning for everyone.</p>

          <a
            href="mailto:support@aiteacher.com"
            className="support-email"
          >
            📧 Support: kgs@gmail.com
          </a>
        </div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
      </footer>
    </div>
  );
}

export default Home;