import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./ExamQuiz.css";

function ExamQuiz() {
  const navigate = useNavigate();

  const examTitle = "Artificial Intelligence";

  const questions = [
    {
      question: "What does AI stand for?",
      options: [
        "Artificial Intelligence",
        "Automated Internet",
        "Advanced Information",
        "Artificial Integration",
      ],
      correct: 0,
    },
    {
      question:
        "Which language is commonly used for Artificial Intelligence?",
      options: ["Python", "HTML", "CSS", "SQL"],
      correct: 0,
    },
    {
      question: "Machine Learning is a part of?",
      options: [
        "Artificial Intelligence",
        "Cloud Storage",
        "Web Designing",
        "Computer Networking",
      ],
      correct: 0,
    },
    {
      question: "Which of the following is an AI application?",
      options: ["Chatbot", "Keyboard", "Monitor", "Mouse"],
      correct: 0,
    },
    {
      question: "What is Machine Learning?",
      options: [
        "A subset of Artificial Intelligence",
        "A programming language",
        "A database",
        "An operating system",
      ],
      correct: 0,
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answers, setAnswers] = useState(
    Array(questions.length).fill(null)
  );

  const [submitted, setSubmitted] = useState(false);

  const [timeLeft, setTimeLeft] = useState(1800);

  // ================= TIMER =================

  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => previousTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  // ================= SAVE RESULT =================

  useEffect(() => {
    if (!submitted) return;

    const score = calculateScore();

    const percentage = Math.round(
      (score / questions.length) * 100
    );

    const result = {
      id: Date.now(),
      subject: examTitle,
      score,
      totalQuestions: questions.length,
      percentage,
      status: percentage >= 40 ? "Passed" : "Failed",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    const oldResults =
      JSON.parse(
        localStorage.getItem("examResults")
      ) || [];

    const alreadySaved = oldResults.some(
      (item) =>
        item.id === result.id
    );

    if (!alreadySaved) {
      localStorage.setItem(
        "examResults",
        JSON.stringify([
          result,
          ...oldResults,
        ])
      );
    }
  }, [submitted]);

  // ================= FORMAT TIME =================

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  // ================= SELECT ANSWER =================

  const handleAnswer = (optionIndex) => {
    if (submitted) return;

    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] =
      optionIndex;

    setAnswers(updatedAnswers);
  };

  // ================= NEXT QUESTION =================

  const nextQuestion = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    }
  };

  // ================= PREVIOUS QUESTION =================

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  // ================= CALCULATE SCORE =================

  function calculateScore() {
    let score = 0;

    questions.forEach(
      (question, index) => {
        if (
          answers[index] ===
          question.correct
        ) {
          score++;
        }
      }
    );

    return score;
  }

  // ================= SUBMIT EXAM =================

  const submitExam = () => {
    const unanswered =
      answers.filter(
        (answer) => answer === null
      ).length;

    if (unanswered > 0) {
      const confirmSubmit =
        window.confirm(
          `You have ${unanswered} unanswered question(s). Do you still want to submit the exam?`
        );

      if (!confirmSubmit) {
        return;
      }
    }

    setSubmitted(true);
  };

  // ================= RETRY EXAM =================

  const retryExam = () => {
    setCurrentQuestion(0);

    setAnswers(
      Array(questions.length).fill(null)
    );

    setTimeLeft(1800);

    setSubmitted(false);
  };

  // ================= RESULT PAGE =================

  if (submitted) {
    const score = calculateScore();

    const percentage = Math.round(
      (score / questions.length) * 100
    );

    const wrongAnswers =
      questions.length - score;

    const passStatus =
      percentage >= 40
        ? "Passed"
        : "Failed";

    return (
      <div className="exam-quiz-page">
        <Navbar />

        <main className="quiz-main">
          <div className="result-container">

            <div className="result-icon">
              {percentage >= 40
                ? "🏆"
                : "📚"}
            </div>

            <p className="quiz-tag">
              EXAM COMPLETED
            </p>

            <h1>Your Result</h1>

            <div className="score-circle">
              <strong>
                {percentage}%
              </strong>

              <span>Score</span>
            </div>

            <h2>
              {passStatus === "Passed"
                ? "Congratulations! You Passed 🎉"
                : "Keep Practicing! 💪"}
            </h2>

            <p className="result-message">
              You answered {score} out of{" "}
              {questions.length} questions
              correctly.
            </p>

            {/* RESULT STATS */}

            <div className="result-stats">

              <div className="result-stat">
                <strong>
                  {questions.length}
                </strong>

                <span>
                  Total Questions
                </span>
              </div>

              <div className="result-stat correct">
                <strong>
                  {score}
                </strong>

                <span>
                  Correct
                </span>
              </div>

              <div className="result-stat wrong">
                <strong>
                  {wrongAnswers}
                </strong>

                <span>
                  Incorrect
                </span>
              </div>

            </div>

            {/* ANSWER REVIEW */}

            <div className="answer-review">

              <h2>
                Answer Review
              </h2>

              {questions.map(
                (question, index) => {
                  const userAnswer =
                    answers[index];

                  const isCorrect =
                    userAnswer ===
                    question.correct;

                  return (
                    <div
                      className={`review-card ${
                        isCorrect
                          ? "correct-answer"
                          : "wrong-answer"
                      }`}
                      key={index}
                    >

                      <h3>
                        Question{" "}
                        {index + 1}
                      </h3>

                      <p>
                        {question.question}
                      </p>

                      <div className="review-answer">

                        <span>
                          Your Answer:
                        </span>

                        <strong>
                          {userAnswer !== null
                            ? question.options[
                                userAnswer
                              ]
                            : "Not Answered"}
                        </strong>

                      </div>

                      {!isCorrect && (
                        <div className="correct-answer-text">

                          Correct Answer:{" "}

                          <strong>
                            {
                              question.options[
                                question.correct
                              ]
                            }
                          </strong>

                        </div>
                      )}

                    </div>
                  );
                }
              )}

            </div>

            {/* RESULT BUTTONS */}

            <div className="result-buttons">

              <button
                className="retry-btn"
                onClick={retryExam}
              >
                🔄 Retry Exam
              </button>

              <button
                className="back-exams-btn"
                onClick={() =>
                  navigate("/exams")
                }
              >
                ← Back to Exams
              </button>

            </div>

          </div>
        </main>
      </div>
    );
  }

  const question =
    questions[currentQuestion];

  // ================= QUIZ PAGE =================

  return (
    <div className="exam-quiz-page">

      <Navbar />

      <main className="quiz-main">

        {/* HEADER */}

        <div className="quiz-header">

          <div>

            <p className="quiz-tag">
              {examTitle.toUpperCase()} EXAM
            </p>

            <h1>
              Question{" "}
              {currentQuestion + 1} of{" "}
              {questions.length}
            </h1>

          </div>

          <div
            className={`quiz-timer ${
              timeLeft < 60
                ? "timer-danger"
                : ""
            }`}
          >
            ⏱️ {formatTime()}
          </div>

        </div>

        {/* PROGRESS BAR */}

        <div className="quiz-progress">

          <div
            className="quiz-progress-fill"
            style={{
              width: `${
                ((currentQuestion + 1) /
                  questions.length) *
                100
              }%`,
            }}
          ></div>

        </div>

        {/* QUESTION NUMBERS */}

        <div className="question-numbers">

          {questions.map(
            (_, index) => (

              <button
                key={index}
                className={`question-number ${
                  currentQuestion ===
                  index
                    ? "active-question"
                    : ""
                } ${
                  answers[index] !==
                  null
                    ? "answered-question"
                    : ""
                }`}
                onClick={() =>
                  setCurrentQuestion(
                    index
                  )
                }
              >
                {index + 1}
              </button>

            )
          )}

        </div>

        {/* QUESTION CARD */}

        <div className="question-card">

          <span className="question-label">
            QUESTION{" "}
            {currentQuestion + 1}
          </span>

          <h2>
            {question.question}
          </h2>

          <div className="options-list">

            {question.options.map(
              (option, index) => (

                <button
                  key={index}
                  className={`option-btn ${
                    answers[
                      currentQuestion
                    ] === index
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleAnswer(
                      index
                    )
                  }
                >

                  <span className="option-letter">
                    {String.fromCharCode(
                      65 + index
                    )}
                  </span>

                  {option}

                </button>

              )
            )}

          </div>

        </div>

        {/* NAVIGATION */}

        <div className="quiz-navigation">

          <button
            className="previous-btn"
            onClick={
              previousQuestion
            }
            disabled={
              currentQuestion === 0
            }
          >
            ← Previous
          </button>

          <div className="navigation-right">

            {currentQuestion <
              questions.length - 1 && (

              <button
                className="next-btn"
                onClick={
                  nextQuestion
                }
              >
                Next →
              </button>

            )}

            {currentQuestion ===
              questions.length - 1 && (

              <button
                className="submit-exam-btn"
                onClick={
                  submitExam
                }
              >
                Submit Exam ✓
              </button>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default ExamQuiz;