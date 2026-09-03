import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("Student");
  const [stats, setStats] = useState([]);
  const [courses, setCourses] = useState([]);
  const [activities, setActivities] = useState([]);
  const [learningTime, setLearningTime] = useState("0h");
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");

    // User not logged in
    if (!email) {
      navigate("/login");
      return;
    }

    // Different data for every email
    const userDataKey = `aiTeacherData_${email}`;

    let savedData = localStorage.getItem(userDataKey);

    // First time user
    if (!savedData) {
      const newUserData = {
        name: email.split("@")[0],
        email: email,

        courses: [
          {
            title: "Artificial Intelligence",
            progress: 0,
            completedLessons: 0,
            totalLessons: 24,
            icon: "🧠",
            nextLesson: "Introduction to Artificial Intelligence",
          },
          {
            title: "Data Structures",
            progress: 0,
            completedLessons: 0,
            totalLessons: 20,
            icon: "💻",
            nextLesson: "Introduction to Data Structures",
          },
          {
            title: "Cloud Computing",
            progress: 0,
            completedLessons: 0,
            totalLessons: 20,
            icon: "☁️",
            nextLesson: "Introduction to Cloud Computing",
          },
        ],

        activities: [],

        learningTime: "0h",

        streak: 0,

        achievements: 0,
      };

      localStorage.setItem(
        userDataKey,
        JSON.stringify(newUserData)
      );

      savedData = JSON.stringify(newUserData);
    }

    const userData = JSON.parse(savedData);

    setUserName(userData.name || email.split("@")[0]);
    setCourses(userData.courses || []);
    setActivities(userData.activities || []);
    setLearningTime(userData.learningTime || "0h");
    setStreak(userData.streak || 0);

    const userCourses = userData.courses || [];

    const averageProgress =
      userCourses.length > 0
        ? Math.round(
            userCourses.reduce(
              (total, course) =>
                total + (course.progress || 0),
              0
            ) / userCourses.length
          )
        : 0;

    const dashboardStats = [
      {
        icon: "📚",
        number: userCourses.length,
        label: "Courses Enrolled",
        color: "blue",
      },
      {
        icon: "⏱️",
        number: userData.learningTime || "0h",
        label: "Learning Time",
        color: "purple",
      },
      {
        icon: "🎯",
        number: `${averageProgress}%`,
        label: "Overall Progress",
        color: "green",
      },
      {
        icon: "🏆",
        number: userData.achievements || 0,
        label: "Achievements",
        color: "orange",
      },
    ];

    setStats(dashboardStats);
  }, [navigate]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const displayName =
    userName.charAt(0).toUpperCase() +
    userName.slice(1);

  const averageProgress =
    courses.length > 0
      ? Math.round(
          courses.reduce(
            (total, course) =>
              total + (course.progress || 0),
            0
          ) / courses.length
        )
      : 0;

  const lessonsLeft = courses.reduce(
    (total, course) =>
      total +
      ((course.totalLessons || 0) -
        (course.completedLessons || 0)),
    0
  );

  const firstCourse =
    courses.length > 0
      ? courses[0]
      : null;

  return (
    <div className="dashboard-page">
      <Navbar />

      {/* BACKGROUND DESIGN */}
      <div className="dashboard-bg">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
        <div className="bg-circle circle-4"></div>
        <div className="bg-circle circle-5"></div>
        <div className="bg-circle circle-6"></div>
      </div>

      <main className="dashboard-main">

        {/* WELCOME SECTION */}
        <section className="dashboard-welcome">

          <div className="welcome-content">

            <span className="welcome-tag">
              ✨ AI LEARNING DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              <span>{displayName}!</span>
            </h1>

            <p className="welcome-date">
              {today}
            </p>

            <p className="welcome-description">
              Continue your learning journey and achieve your
              goals with your personal AI Teacher.
            </p>

            <div className="welcome-buttons">

              <button
                className="primary-welcome-btn"
                onClick={() =>
                  navigate("/my-learning")
                }
              >
                Continue Learning →
              </button>

              <button
                className="secondary-welcome-btn"
                onClick={() =>
                  navigate("/exams")
                }
              >
                📝 View Exams
              </button>

            </div>

          </div>

          <div className="welcome-ai">

            <div className="ai-glow"></div>

            <div className="ai-robot">
              🤖
            </div>

            <div className="ai-status">

              <span className="status-dot"></span>

              AI Teacher Online

            </div>

          </div>

        </section>


        {/* STATISTICS */}
        <section className="stats-grid">

          {stats.map((stat) => (

            <div
              className={`stat-card ${stat.color}`}
              key={stat.label}
            >

              <div className="stat-icon">
                {stat.icon}
              </div>

              <div className="stat-info">

                <h2>
                  {stat.number}
                </h2>

                <p>
                  {stat.label}
                </p>

              </div>

            </div>

          ))}

        </section>


        {/* QUICK ACTIONS */}
        <section className="quick-actions-section">

          <div className="section-header">

            <div>

              <span className="small-tag">
                QUICK ACTIONS
              </span>

              <h2>
                What do you want to do?
              </h2>

            </div>

          </div>


          <div className="quick-actions-grid">

            <button
              className="quick-action-card"
              onClick={() =>
                navigate("/my-learning")
              }
            >

              <div className="quick-action-icon learning-action">
                📚
              </div>

              <div className="quick-action-content">

                <h3>
                  My Learning
                </h3>

                <p>
                  Continue your courses
                </p>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>


            <button
              className="quick-action-card"
              onClick={() =>
                navigate("/exams")
              }
            >

              <div className="quick-action-icon exam-action">
                📝
              </div>

              <div className="quick-action-content">

                <h3>
                  Take an Exam
                </h3>

                <p>
                  Test your knowledge
                </p>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>


            <button
              className="quick-action-card"
              onClick={() =>
                navigate("/profile")
              }
            >

              <div className="quick-action-icon profile-action">
                👤
              </div>

              <div className="quick-action-content">

                <h3>
                  My Profile
                </h3>

                <p>
                  View your profile
                </p>

              </div>

              <span className="quick-arrow">
                →
              </span>

            </button>

          </div>

        </section>


        {/* MAIN CONTENT */}
        <section className="dashboard-content">


          {/* CONTINUE LEARNING */}
          <div className="dashboard-section courses-section">

            <div className="section-header">

              <div>

                <span className="small-tag">
                  MY LEARNING
                </span>

                <h2>
                  Continue Learning
                </h2>

              </div>


              <button
                className="view-all-btn"
                onClick={() =>
                  navigate("/my-learning")
                }
              >
                View All →
              </button>

            </div>


            <div className="course-list">

              {courses.map((course) => (

                <div
                  className="course-card"
                  key={course.title}
                >

                  <div className="course-icon">
                    {course.icon}
                  </div>


                  <div className="course-info">

                    <h3>
                      {course.title}
                    </h3>

                    <p>
                      {course.completedLessons || 0}
                      {" / "}
                      {course.totalLessons || 0}
                      {" Lessons"}
                    </p>

                    <span className="next-lesson">
                      Next: {course.nextLesson}
                    </span>


                    <div className="progress-bar">

                      <div
                        className="progress-fill"
                        style={{
                          width: `${course.progress || 0}%`,
                        }}
                      ></div>

                    </div>

                  </div>


                  <div className="course-progress">

                    <strong>
                      {course.progress || 0}%
                    </strong>


                    <button
                      onClick={() =>
                        navigate("/my-learning")
                      }
                    >
                      Continue →
                    </button>

                  </div>

                </div>

              ))}

            </div>

          </div>


          {/* DAILY GOAL */}
          <div className="dashboard-section goal-section">

            <span className="small-tag">
              TODAY'S GOAL
            </span>

            <h2>
              Keep Going! 🚀
            </h2>

            <p>
              Every lesson brings you closer to your goal.
            </p>


            <div className="goal-circle">

              <div className="goal-inner">

                <strong>
                  {averageProgress}%
                </strong>

                <span>
                  Progress
                </span>

              </div>

            </div>


            <div className="goal-info">

              <div>

                <strong>
                  {learningTime}
                </strong>

                <span>
                  Learning
                </span>

              </div>


              <div>

                <strong>
                  {lessonsLeft}
                </strong>

                <span>
                  Lessons Left
                </span>

              </div>

            </div>


            <div className="goal-footer">

              🎯 Daily learning streak:

              <strong>
                {" "}
                {streak} Days 🔥
              </strong>

            </div>

          </div>

        </section>


        {/* BOTTOM GRID */}
        <section className="bottom-grid">


          {/* AI RECOMMENDATION */}
          <div className="dashboard-section ai-suggestion">

            <div className="suggestion-top">

              <div className="suggestion-icon">
                🧠
              </div>

              <span>
                AI RECOMMENDATION
              </span>

            </div>


            <h2>
              Ready for your next lesson?
            </h2>


            <p>

              {firstCourse ? (
                <>
                  Based on your learning progress, your
                  AI Teacher recommends continuing with
                  <strong>
                    {" "}
                    {firstCourse.title}
                  </strong>
                  {" "}today.
                </>
              ) : (
                <>
                  Start your learning journey with AI Teacher.
                </>
              )}

            </p>


            <div className="recommendation-box">

              <span>
                💡
              </span>

              <p>
                Learn consistently to improve your progress!
              </p>

            </div>


            <button
              className="start-btn"
              onClick={() =>
                navigate("/my-learning")
              }
            >
              Start Learning →
            </button>

          </div>


          {/* UPCOMING EXAM */}
          <div className="dashboard-section upcoming-exam">

            <span className="small-tag">
              UPCOMING EXAM
            </span>

            <h2>
              Ready to Test Yourself?
            </h2>


            <div className="exam-preview">

              <div className="exam-preview-icon">
                📝
              </div>


              <div className="exam-preview-details">

                <p>
                  Complete your courses and take exams
                </p>

                <p>
                  Track your performance
                </p>

                <p>
                  Improve your learning
                </p>

              </div>

            </div>


            <button
              className="view-exam-btn"
              onClick={() =>
                navigate("/exams")
              }
            >
              View Exams →
            </button>

          </div>

        </section>


        {/* RECENT ACTIVITY */}
        <section className="dashboard-section activity-section">

          <div className="section-header">

            <div>

              <span className="small-tag">
                RECENT ACTIVITY
              </span>

              <h2>
                Your Learning Activity
              </h2>

            </div>


            <button
              className="view-all-btn"
              onClick={() =>
                navigate("/profile")
              }
            >
              View Profile →
            </button>

          </div>


          <div className="activity-list">

            {activities.length === 0 ? (

              <div className="activity-item">

                <div className="activity-icon blue">
                  🚀
                </div>

                <div className="activity-content">

                  <h4>
                    Start Your Learning Journey
                  </h4>

                  <p>
                    Complete lessons to see your activity here.
                  </p>

                </div>

              </div>

            ) : (

              activities.map(
                (activity, index) => (

                  <div
                    className="activity-item"
                    key={index}
                  >

                    <div
                      className={`activity-icon ${
                        activity.type || "blue"
                      }`}
                    >

                      {activity.icon || "✓"}

                    </div>


                    <div className="activity-content">

                      <h4>
                        {activity.title}
                      </h4>

                      <p>
                        {activity.time}
                      </p>

                    </div>


                    <div className="activity-status">
                      ✓
                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>


        {/* MOTIVATION */}
        <section className="motivation-card">

          <div className="motivation-icon">
            🚀
          </div>


          <div className="motivation-content">

            <span>
              DAILY MOTIVATION
            </span>

            <h2>
              Small progress every day leads to big results.
            </h2>

            <p>
              Keep learning, keep growing, and let AI Teacher
              guide your journey.
            </p>

          </div>


          <button
            onClick={() =>
              navigate("/my-learning")
            }
          >
            Continue →
          </button>

        </section>

      </main>

    </div>
  );
}

export default Dashboard;