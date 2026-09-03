import { useState } from "react";
import "./Settings.css";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  const [language, setLanguage] = useState("English");
  const [learningLevel, setLearningLevel] = useState("Beginner");

  const handleSave = () => {
    alert("Settings saved successfully! 🎉");
  };

  return (
    <div className="settings-page">
      {/* HEADER */}

      <div className="settings-header">
        <div>
          <p className="settings-tag">SYSTEM SETTINGS</p>

          <h1>Settings ⚙️</h1>

          <p>
            Customize your AI Teacher experience and manage
            your learning preferences.
          </p>
        </div>

        <button className="settings-save-btn" onClick={handleSave}>
          ✓ Save Settings
        </button>
      </div>

      {/* SETTINGS GRID */}

      <div className="settings-grid">

        {/* LEFT SIDE */}

        <div className="settings-main">

          {/* AI PREFERENCES */}

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon purple">🤖</div>

              <div>
                <p>AI CONFIGURATION</p>
                <h2>AI Learning Preferences</h2>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <h3>AI Suggestions</h3>
                <p>
                  Get personalized learning recommendations
                  from AI.
                </p>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={aiSuggestions}
                  onChange={() =>
                    setAiSuggestions(!aiSuggestions)
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-select-group">
              <label>Preferred Learning Language</label>

              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Marathi</option>
                <option>Hinglish</option>
              </select>
            </div>

            <div className="setting-select-group">
              <label>Default Learning Level</label>

              <select
                value={learningLevel}
                onChange={(e) =>
                  setLearningLevel(e.target.value)
                }
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          {/* NOTIFICATIONS */}

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon blue">🔔</div>

              <div>
                <p>NOTIFICATIONS</p>
                <h2>Notification Preferences</h2>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <h3>Push Notifications</h3>
                <p>
                  Receive reminders about your learning goals.
                </p>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() =>
                    setNotifications(!notifications)
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-row">
              <div>
                <h3>Email Updates</h3>
                <p>
                  Receive weekly learning reports and updates.
                </p>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={emailUpdates}
                  onChange={() =>
                    setEmailUpdates(!emailUpdates)
                  }
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* LEARNING */}

          <div className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon orange">📚</div>

              <div>
                <p>LEARNING SETTINGS</p>
                <h2>Learning Experience</h2>
              </div>
            </div>

            <div className="setting-row">
              <div>
                <h3>Auto Save Progress</h3>
                <p>
                  Automatically save your course and lesson progress.
                </p>
              </div>

              <label className="switch">
                <input
                  type="checkbox"
                  checked={autoSave}
                  onChange={() =>
                    setAutoSave(!autoSave)
                  }
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="settings-sidebar">

          {/* ACCOUNT */}

          <div className="settings-side-card">

            <div className="account-avatar">
              SA
            </div>

            <h2>Sumit Ade</h2>

            <p>AI Teacher Student</p>

            <div className="account-status">
              <span></span>
              Account Active
            </div>

            <button>
              Manage Profile →
            </button>

          </div>

          {/* AI STATUS */}

          <div className="ai-status-card">

            <div className="ai-status-icon">
              🤖
            </div>

            <p>AI SYSTEM STATUS</p>

            <h2>All Systems Active</h2>

            <div className="system-status-row">
              <span>AI Learning Engine</span>
              <strong>● Online</strong>
            </div>

            <div className="system-status-row">
              <span>Recommendation System</span>
              <strong>● Online</strong>
            </div>

            <div className="system-status-row">
              <span>Learning Analytics</span>
              <strong>● Online</strong>
            </div>

          </div>

          {/* HELP */}

          <div className="help-card">

            <div className="help-icon">
              💡
            </div>

            <div>
              <h3>Need Help?</h3>

              <p>
                Contact AI Teacher support for assistance.
              </p>

              <button>
                Contact Support →
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Settings;