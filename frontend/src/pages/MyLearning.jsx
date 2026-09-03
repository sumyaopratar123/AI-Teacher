import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./MyLearning.css";

const DEFAULT_COURSES = [
  {
    id: "ai",
    icon: "🧠",
    title: "Artificial Intelligence",
    totalLessons: 24,
    completedLessons: 0,
    progress: 0,
    color: "purple",
    playlistId: "PLxCzCOWd7aiHGhOHV-nwb0HR5US5GFKFI",
    videoId: "uB3i-qV6VdM",
  },
  {
    id: "ds",
    icon: "💻",
    title: "Data Structures",
    totalLessons: 20,
    completedLessons: 0,
    progress: 0,
    color: "blue",
    playlistId: "PLxCzCOWd7aiEwaANNt3OqJPVIxwp2ebiT",
    videoId: "qNGyI95E5AE",
  },
  {
    id: "cloud",
    icon: "☁️",
    title: "Cloud Computing",
    totalLessons: 20,
    completedLessons: 0,
    progress: 0,
    color: "green",
    playlistId: "PLxCzCOWd7aiHRHVUtR-O52MsrdUSrzuy4",
    videoId: "dmGybCohHsw",
  },
  {
    id: "python",
    icon: "🐍",
    title: "Python Programming",
    totalLessons: 30,
    completedLessons: 0,
    progress: 0,
    color: "orange",
    playlistId: "PLu0W_9lII9agwh1XjRt242xIpHhPT2llg",
    videoId: "7wnove7K-ZQ",
  },
];

function MyLearning() {
  const navigate = useNavigate();

  const userEmail =
    localStorage.getItem("userEmail") || "guest";

  const storageKey =
    `aiTeacherLearning_${userEmail}`;

  const [selectedCourse, setSelectedCourse] =
    useState(null);

  const [courses, setCourses] = useState(() => {
    try {
      const savedData =
        localStorage.getItem(storageKey);

      if (savedData) {
        const parsedCourses =
          JSON.parse(savedData);

        /*
          Old saved data may not contain
          playlist information.
          Merge it with DEFAULT_COURSES.
        */
        return DEFAULT_COURSES.map(
          (defaultCourse) => {
            const savedCourse =
              parsedCourses.find(
                (course) =>
                  course.id === defaultCourse.id
              );

            return {
              ...defaultCourse,
              ...(savedCourse || {}),
              playlistId:
                defaultCourse.playlistId,
              videoId:
                defaultCourse.videoId,
            };
          }
        );
      }

      return DEFAULT_COURSES;
    } catch (error) {
      return DEFAULT_COURSES;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify(courses)
    );
  }, [courses, storageKey]);


  const statistics = useMemo(() => {
    const activeCourses = courses.length;

    const totalCompletedLessons =
      courses.reduce(
        (total, course) =>
          total + course.completedLessons,
        0
      );

    const averageProgress =
      activeCourses > 0
        ? Math.round(
            courses.reduce(
              (total, course) =>
                total + course.progress,
              0
            ) / activeCourses
          )
        : 0;

    const learningMinutes =
      totalCompletedLessons * 15;

    const learningHours =
      learningMinutes / 60;

    return {
      activeCourses,
      totalCompletedLessons,
      averageProgress,
      learningHours,
    };
  }, [courses]);


  /*
    Open course player
  */
  const handleContinue = (course) => {
    setSelectedCourse(course);
  };


  /*
    Mark one lesson as completed
  */
  const handleLessonCompleted = () => {
    if (!selectedCourse) return;

    setCourses((previousCourses) =>
      previousCourses.map((course) => {
        if (course.id !== selectedCourse.id) {
          return course;
        }

        if (
          course.completedLessons >=
          course.totalLessons
        ) {
          return course;
        }

        const updatedCompletedLessons =
          course.completedLessons + 1;

        const updatedProgress = Math.round(
          (updatedCompletedLessons /
            course.totalLessons) *
            100
        );

        const updatedCourse = {
          ...course,
          completedLessons:
            updatedCompletedLessons,
          progress: Math.min(
            updatedProgress,
            100
          ),
        };

        setSelectedCourse(updatedCourse);

        return updatedCourse;
      })
    );
  };


  const recommendedCourse =
    courses.find(
      (course) => course.progress < 100
    ) || courses[0];


  /*
    ============================
    COURSE PLAYER PAGE
    ============================
  */

  if (selectedCourse) {
    const embedUrl =
      `https://www.youtube.com/embed/${selectedCourse.videoId}?list=${selectedCourse.playlistId}&rel=0`;

    return (
      <div className="my-learning-page">

        <Navbar />

        <main className="learning-main">

          {/* BACK BUTTON */}

          <button
            className="back-course-btn"
            onClick={() =>
              setSelectedCourse(null)
            }
          >
            ← Back to My Learning
          </button>


          {/* COURSE PLAYER HEADER */}

          <section className="course-player-header">

            <div className="course-player-title">

              <div
                className={`course-player-icon ${selectedCourse.color}`}
              >
                {selectedCourse.icon}
              </div>

              <div>

                <p className="learning-tag">
                  NOW LEARNING
                </p>

                <h1>
                  {selectedCourse.title}
                </h1>

                <p>
                  Learn the complete course
                  directly inside AI Teacher.
                </p>

              </div>

            </div>

          </section>


          {/* VIDEO PLAYER */}

          <section className="youtube-player-card">

            <div className="youtube-player-wrapper">

              <iframe
                src={embedUrl}
                title={`${selectedCourse.title} Playlist`}
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture
                "
                allowFullScreen
              />

            </div>

          </section>


          {/* COURSE PROGRESS */}

          <section className="player-progress-card">

            <div className="player-progress-header">

              <div>

                <p className="learning-tag">
                  YOUR PROGRESS
                </p>

                <h2>
                  Course Progress
                </h2>

              </div>

              <strong>
                {selectedCourse.progress}%
              </strong>

            </div>


            <div className="course-progress-info">

              <span>
                {
                  selectedCourse.completedLessons
                } / {
                  selectedCourse.totalLessons
                } Lessons Completed
              </span>

              <span>
                Keep Learning 🚀
              </span>

            </div>


            <div className="learning-progress-bar">

              <div
                className={`learning-progress-fill ${selectedCourse.color}`}
                style={{
                  width:
                    `${selectedCourse.progress}%`,
                }}
              />

            </div>


            <button
              className="complete-lesson-btn"
              onClick={
                handleLessonCompleted
              }
              disabled={
                selectedCourse.completedLessons >=
                selectedCourse.totalLessons
              }
            >

              {selectedCourse.completedLessons >=
              selectedCourse.totalLessons
                ? "Course Completed 🎉"
                : "✓ Mark Lesson as Completed"}

            </button>

          </section>


          {/* COURSE INFORMATION */}

          <section className="course-info-card">

            <h2>
              📚 Learning Information
            </h2>

            <div className="course-info-grid">

              <div>
                <span>
                  Total Lessons
                </span>

                <strong>
                  {
                    selectedCourse.totalLessons
                  }
                </strong>
              </div>


              <div>
                <span>
                  Completed
                </span>

                <strong>
                  {
                    selectedCourse.completedLessons
                  }
                </strong>
              </div>


              <div>
                <span>
                  Progress
                </span>

                <strong>
                  {
                    selectedCourse.progress
                  }%
                </strong>
              </div>

            </div>

          </section>

        </main>

      </div>
    );
  }


  /*
    ============================
    MAIN MY LEARNING PAGE
    ============================
  */

  return (
    <div className="my-learning-page">

      <Navbar />

      <main className="learning-main">


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
              Track your progress and continue
              learning at your own pace.
            </p>

          </div>

        </section>


        {/* STATISTICS */}

        <section className="learning-stats">


          <div className="learning-stat-card">

            <div className="learning-stat-icon">
              📚
            </div>

            <div>

              <h2>
                {statistics.activeCourses}
              </h2>

              <p>
                Active Courses
              </p>

            </div>

          </div>


          <div className="learning-stat-card">

            <div className="learning-stat-icon purple">
              ⏱️
            </div>

            <div>

              <h2>
                {statistics.learningHours.toFixed(1)}h
              </h2>

              <p>
                Learning Time
              </p>

            </div>

          </div>


          <div className="learning-stat-card">

            <div className="learning-stat-icon green">
              🎯
            </div>

            <div>

              <h2>
                {statistics.averageProgress}%
              </h2>

              <p>
                Average Progress
              </p>

            </div>

          </div>


          <div className="learning-stat-card">

            <div className="learning-stat-icon orange">
              🔥
            </div>

            <div>

              <h2>
                {statistics.totalCompletedLessons}
              </h2>

              <p>
                Lessons Completed
              </p>

            </div>

          </div>

        </section>


        {/* COURSES */}

        <section className="courses-learning-section">


          <div className="learning-section-header">

            <div>

              <p className="learning-tag">
                YOUR COURSES
              </p>

              <h2>
                Courses In Progress
              </h2>

            </div>


            <button
              className="explore-btn"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              Back to Home →
            </button>

          </div>


          {/* COURSE GRID */}

          <div className="learning-course-grid">

            {courses.map((course) => (

              <div
                className="learning-course-card"
                key={course.id}
              >


                <div
                  className={`course-top-icon ${course.color}`}
                >
                  {course.icon}
                </div>


                <h3>
                  {course.title}
                </h3>


                <p className="course-lessons">

                  {
                    course.completedLessons
                  } / {

                    course.totalLessons

                  } Lessons Completed

                </p>


                <div className="course-progress-info">

                  <span>
                    Course Progress
                  </span>

                  <strong>
                    {course.progress}%
                  </strong>

                </div>


                <div className="learning-progress-bar">

                  <div
                    className={`learning-progress-fill ${course.color}`}
                    style={{
                      width:
                        `${course.progress}%`,
                    }}
                  />

                </div>


                <button
                  className="continue-course-btn"
                  onClick={() =>
                    handleContinue(course)
                  }
                >

                  {course.progress === 100
                    ? "Course Completed ✓"
                    : "Continue Learning →"}

                </button>

              </div>

            ))}

          </div>

        </section>


        {/* AI RECOMMENDATION */}

        {recommendedCourse && (

          <section className="learning-recommendation">


            <div className="recommendation-icon">

              {
                recommendedCourse.icon
              }

            </div>


            <div className="recommendation-content">

              <p className="learning-tag">
                AI RECOMMENDATION
              </p>


              <h2>

                Continue{" "}

                {
                  recommendedCourse.title
                }

              </h2>


              <p>

                You have completed{" "}

                {
                  recommendedCourse.completedLessons
                }{" "}

                out of{" "}

                {
                  recommendedCourse.totalLessons
                }{" "}

                lessons. Continue learning to
                improve your progress.

              </p>

            </div>


            <button
              className="recommendation-btn"
              onClick={() =>
                handleContinue(
                  recommendedCourse
                )
              }
            >

              Start Learning →

            </button>

          </section>

        )}

      </main>

    </div>
  );
}

export default MyLearning;