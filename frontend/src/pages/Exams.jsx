import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "./Exams.css";

function Exams() {
  const navigate = useNavigate();

  // Current logged-in user
  const currentUserEmail = localStorage.getItem(
    "currentUserEmail"
  );

  // Get all users
  const users =
    JSON.parse(
      localStorage.getItem("aiTeacherUsers")
    ) || {};

  // Get current user's exam results
  const currentUser = users[currentUserEmail];

  const results =
    currentUser?.exams || [];

  // Calculate average score
  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce(
            (total, result) =>
              total + Number(result.score),
            0
          ) / results.length
        )
      : 0;

  const exams = [
    {
      title: "Artificial Intelligence",
      date: "15 September 2026",
      time: "10:00 AM",
      duration: "60 Minutes",
      questions: "30 Questions",
      status: "Upcoming",
      icon: "🧠",
    },
    {
      title: "Data Structures",
      date: "18 September 2026",
      time: "11:00 AM",
      duration: "45 Minutes",
      questions: "25 Questions",
      status: "Upcoming",
      icon: "💻",
    },
    {
      title: "Cloud Computing",
      date: "22 September 2026",
      time: "2:00 PM",
      duration: "60 Minutes",
      questions: "30 Questions",
      status: "Upcoming",
      icon: "☁️",
    },
  ];

  const handleStartExam = (exam) => {
    navigate("/exam-quiz", {
      state: {
        examTitle: exam.title,
      },
    });
  };

  return (
    <div className="exams-page">

      <Navbar />

      <main className="exams-main">

        {/* HEADER */}

        <section className="exams-header">

          <div>

            <span className="exam-tag">
              📝 AI LEARNING ASSESSMENTS
            </span>

            <h1>
              Your <span>Exams</span>
            </h1>

            <p>
              Test your knowledge, track your performance,
              and improve your learning journey.
            </p>

          </div>

          <div className="exam-header-icon">
            📝
          </div>

        </section>


        {/* EXAM STATS */}

        <section className="exam-stats">

          <div className="exam-stat-card">

            <span>📝</span>

            <div>

              <h2>
                {exams.length}
              </h2>

              <p>
                Upcoming Exams
              </p>

            </div>

          </div>


          <div className="exam-stat-card">

            <span>🏆</span>

            <div>

              <h2>
                {results.length}
              </h2>

              <p>
                Completed Exams
              </p>

            </div>

          </div>


          <div className="exam-stat-card">

            <span>📊</span>

            <div>

              <h2>
                {averageScore}%
              </h2>

              <p>
                Average Score
              </p>

            </div>

          </div>

        </section>


        {/* UPCOMING EXAMS */}

        <section className="exam-section">

          <div className="exam-section-header">

            <div>

              <span>
                UPCOMING EXAMS
              </span>

              <h2>
                Get Ready to Test Yourself
              </h2>

            </div>

          </div>


          <div className="exam-grid">

            {exams.map((exam) => (

              <div
                className="exam-card"
                key={exam.title}
              >

                <div className="exam-card-top">

                  <div className="exam-icon">
                    {exam.icon}
                  </div>

                  <span className="upcoming-status">
                    {exam.status}
                  </span>

                </div>


                <h3>
                  {exam.title}
                </h3>


                <div className="exam-details">

                  <p>
                    📅 {exam.date}
                  </p>

                  <p>
                    ⏰ {exam.time}
                  </p>

                  <p>
                    ⏱️ {exam.duration}
                  </p>

                  <p>
                    ❓ {exam.questions}
                  </p>

                </div>


                <button
                  className="exam-start-btn"
                  onClick={() =>
                    handleStartExam(exam)
                  }
                >

                  Start Exam →

                </button>

              </div>

            ))}

          </div>

        </section>


        {/* EXAM RESULTS */}

        <section className="results-section">

          <div className="exam-section-header">

            <div>

              <span>
                RECENT RESULTS
              </span>

              <h2>
                Your Exam Performance
              </h2>

            </div>

          </div>


          <div className="results-list">

            {results.length === 0 ? (

              <div
                className="result-card"
              >

                <div className="result-left">

                  <div className="result-icon">
                    📝
                  </div>

                  <div>

                    <h3>
                      No Exams Completed Yet
                    </h3>

                    <p>
                      Start an exam to see your results here.
                    </p>

                  </div>

                </div>

              </div>

            ) : (

              results.map(
                (result, index) => (

                  <div
                    className="result-card"
                    key={index}
                  >

                    <div className="result-left">

                      <div className="result-icon">
                        🏆
                      </div>

                      <div>

                        <h3>
                          {result.subject}
                        </h3>

                        <p>
                          Exam Completed Successfully
                        </p>

                      </div>

                    </div>


                    <div className="result-right">

                      <strong>
                        {result.score}%
                      </strong>

                      <span>
                        {result.status}
                      </span>

                    </div>

                  </div>

                )
              )

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default Exams;