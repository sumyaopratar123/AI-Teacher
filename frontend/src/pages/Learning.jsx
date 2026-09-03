import { useState } from "react";
import Navbar from "../components/Navbar";
import "./Learning.css";

function Learning() {
  const [activeLesson, setActiveLesson] = useState(1);

  const lessons = [
    {
      title: "Introduction to Artificial Intelligence",
      duration: "8 min",
      status: "Completed",
      icon: "🤖",
    },
    {
      title: "Machine Learning Fundamentals",
      duration: "12 min",
      status: "In Progress",
      icon: "🧠",
    },
    {
      title: "Neural Networks Explained",
      duration: "15 min",
      status: "Upcoming",
      icon: "⚡",
    },
    {
      title: "Real World AI Applications",
      duration: "10 min",
      status: "Upcoming",
      icon: "🌍",
    },
  ];

  const progress = 42;

  return (
    <div className="learning-page">
      
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="learning-content">

        {/* HEADER */}
        <section className="learning-header">
          <div>
            <p className="learning-tag">
              PERSONALIZED LEARNING
            </p>

            <h1>
              Continue Learning 🚀
            </h1>

            <p className="learning-description">
              Your AI-powered learning journey is ready.
              Learn at your own pace.
            </p>
          </div>
        </section>


        {/* TOP CARDS */}
        <section className="learning-grid">

          {/* COURSE CARD */}
          <div className="main-learning-card">

            <div className="course-top">

              <div className="course-icon">
                🤖
              </div>

              <div>
                <p className="small-label">
                  CURRENT COURSE
                </p>

                <h2>
                  Artificial Intelligence
                </h2>

                <p className="course-description">
                  Beginner • English • 20 Minutes Daily
                </p>
              </div>

            </div>


            {/* PROGRESS */}
            <div className="progress-section">

              <div className="progress-title">
                <span>
                  Course Progress
                </span>

                <strong>
                  {progress}%
                </strong>
              </div>


              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>


              <p className="progress-text">
                You are making great progress!
                Keep learning every day.
              </p>

            </div>


            <button
              className="continue-btn"
              onClick={() => setActiveLesson(1)}
            >
              Continue Learning →
            </button>

          </div>


          {/* AI CARD */}
          <div className="ai-learning-card">

            <div className="ai-card-content">

              <div className="ai-avatar">
                🤖
              </div>

              <p className="small-label ai-label">
                YOUR AI TEACHER
              </p>

              <h2>
                Need help?
              </h2>

              <p>
                Ask me anything about your lesson.
                I can explain concepts step-by-step.
              </p>

              <button className="ask-ai-btn">
                Ask AI Teacher ✨
              </button>

            </div>

          </div>

        </section>


        {/* LESSON HEADER */}
        <section className="lessons-header">

          <div>
            <p className="learning-tag">
              YOUR ROADMAP
            </p>

            <h2>
              Course Lessons
            </h2>
          </div>


          <span className="lesson-count">
            {lessons.length} Lessons
          </span>

        </section>


        {/* LESSONS */}
        <section className="lessons-list">

          {lessons.map((lesson, index) => (

            <div
              className={`lesson-card ${
                activeLesson === index
                  ? "active-lesson"
                  : ""
              }`}
              key={index}
              onClick={() =>
                setActiveLesson(index)
              }
            >

              <div className="lesson-number">

                {lesson.status === "Completed"
                  ? "✓"
                  : index + 1}

              </div>


              <div className="lesson-icon">
                {lesson.icon}
              </div>


              <div className="lesson-info">

                <h3>
                  {lesson.title}
                </h3>


                <div className="lesson-meta">

                  <span>
                    ⏱ {lesson.duration}
                  </span>


                  <span
                    className={`lesson-status ${lesson.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {lesson.status}
                  </span>

                </div>

              </div>


              <button className="lesson-arrow">
                →
              </button>

            </div>

          ))}

        </section>

      </main>

    </div>
  );
}

export default Learning;