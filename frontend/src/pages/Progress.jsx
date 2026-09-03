import "./Progress.css";

function Progress() {
  const weeklyData = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 70 },
    { day: "Wed", value: 55 },
    { day: "Thu", value: 90 },
    { day: "Fri", value: 65 },
    { day: "Sat", value: 80 },
    { day: "Sun", value: 60 },
  ];

  const skills = [
    {
      name: "Artificial Intelligence",
      progress: 42,
      icon: "🤖",
    },
    {
      name: "Python Programming",
      progress: 75,
      icon: "🐍",
    },
    {
      name: "Machine Learning",
      progress: 15,
      icon: "🧠",
    },
    {
      name: "Data Structures",
      progress: 30,
      icon: "📊",
    },
  ];

  const achievements = [
    {
      icon: "🔥",
      title: "Learning Streak",
      description: "Keep learning every day!",
      value: "7 Days",
    },
    {
      icon: "⏱️",
      title: "Learning Time",
      description: "Total time spent learning",
      value: "12.5 Hours",
    },
    {
      icon: "📚",
      title: "Lessons Completed",
      description: "Keep up the good work",
      value: "18",
    },
  ];

  return (
    <div className="progress-page">

      {/* HEADER */}

      <div className="progress-header">
        <div>
          <p className="progress-tag">
            LEARNING ANALYTICS
          </p>

          <h1>Your Progress 📈</h1>

          <p>
            Track your learning journey and see how much
            you have improved.
          </p>
        </div>

        <div className="progress-date">
          📅 This Week
        </div>
      </div>

      {/* TOP STATS */}

      <div className="progress-stats">

        <div className="progress-stat-card">
          <div className="progress-stat-icon purple">
            🎯
          </div>

          <div>
            <p>Overall Progress</p>
            <h2>42%</h2>
            <span>+8% this week</span>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-icon orange">
            🔥
          </div>

          <div>
            <p>Current Streak</p>
            <h2>7 Days</h2>
            <span>Keep it going!</span>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-icon blue">
            ⏱
          </div>

          <div>
            <p>Total Learning</p>
            <h2>12.5h</h2>
            <span>+2.3h this week</span>
          </div>
        </div>

        <div className="progress-stat-card">
          <div className="progress-stat-icon green">
            🏆
          </div>

          <div>
            <p>Completed Lessons</p>
            <h2>18</h2>
            <span>Great progress!</span>
          </div>
        </div>

      </div>

      {/* MAIN GRID */}

      <div className="progress-main-grid">

        {/* WEEKLY ACTIVITY */}

        <div className="weekly-card">

          <div className="card-heading">
            <div>
              <p className="small-heading">
                WEEKLY ACTIVITY
              </p>

              <h2>Learning Activity</h2>
            </div>

            <span className="activity-label">
              +18% ↑
            </span>
          </div>

          <div className="chart-area">

            {weeklyData.map((item, index) => (
              <div className="bar-item" key={index}>

                <div className="bar-wrapper">
                  <div
                    className="bar"
                    style={{
                      height: `${item.value}%`,
                    }}
                  ></div>
                </div>

                <span>{item.day}</span>

              </div>
            ))}

          </div>

          <div className="chart-footer">
            <span>
              📚 5 Lessons Completed
            </span>

            <span>
              ⏱ 2.3 Hours Learned
            </span>
          </div>

        </div>

        {/* AI INSIGHT */}

        <div className="progress-ai-card">

          <div className="ai-orb">
            ✨
          </div>

          <p>AI INSIGHT</p>

          <h2>
            You're making great progress!
          </h2>

          <div className="ai-insight-box">
            <span>🤖</span>

            <p>
              Your learning consistency improved by
              18% this week. Keep studying regularly!
            </p>
          </div>

          <button>
            Get AI Recommendations →
          </button>

        </div>

      </div>

      {/* SKILLS */}

      <div className="skills-section-header">

        <div>
          <p className="progress-tag">
            SKILL DEVELOPMENT
          </p>

          <h2>Your Learning Progress</h2>
        </div>

        <span>
          4 Active Courses
        </span>

      </div>

      <div className="skills-grid">

        {skills.map((skill, index) => (

          <div className="skill-card" key={index}>

            <div className="skill-top">

              <div className="skill-icon">
                {skill.icon}
              </div>

              <strong>
                {skill.progress}%
              </strong>

            </div>

            <h3>{skill.name}</h3>

            <div className="skill-progress-bar">

              <div
                className="skill-progress-fill"
                style={{
                  width: `${skill.progress}%`,
                }}
              ></div>

            </div>

            <p>
              {skill.progress < 25
                ? "Just getting started"
                : skill.progress < 50
                ? "Making good progress"
                : "Excellent progress"}
            </p>

          </div>

        ))}

      </div>

      {/* ACHIEVEMENTS */}

      <div className="achievement-section">

        <div className="achievement-heading">

          <div>
            <p className="progress-tag">
              YOUR ACHIEVEMENTS
            </p>

            <h2>Learning Highlights 🏆</h2>
          </div>

        </div>

        <div className="achievement-grid">

          {achievements.map((item, index) => (

            <div
              className="achievement-card"
              key={index}
            >

              <div className="achievement-icon">
                {item.icon}
              </div>

              <div>
                <h3>{item.title}</h3>

                <p>
                  {item.description}
                </p>
              </div>

              <strong>
                {item.value}
              </strong>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Progress;