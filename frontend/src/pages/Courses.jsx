import { useState } from "react";
import "./Courses.css";

function Courses() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const courses = [
    {
      id: 1,
      title: "Artificial Intelligence",
      description:
        "Learn the fundamentals of AI and understand how intelligent systems work.",
      category: "Technology",
      progress: 42,
      lessons: 12,
      duration: "4h 30m",
      icon: "🤖",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Python Programming",
      description:
        "Learn Python from beginner concepts to practical programming projects.",
      category: "Programming",
      progress: 75,
      lessons: 18,
      duration: "6h 20m",
      icon: "🐍",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Machine Learning",
      description:
        "Discover how machines learn from data and make intelligent predictions.",
      category: "Technology",
      progress: 15,
      lessons: 20,
      duration: "8h 10m",
      icon: "🧠",
      status: "Started",
    },
    {
      id: 4,
      title: "Web Development",
      description:
        "Build modern websites using HTML, CSS, JavaScript and React.",
      category: "Programming",
      progress: 0,
      lessons: 24,
      duration: "10h 00m",
      icon: "💻",
      status: "Not Started",
    },
    {
      id: 5,
      title: "Data Structures",
      description:
        "Understand arrays, linked lists, stacks, queues and trees.",
      category: "Computer Science",
      progress: 30,
      lessons: 16,
      duration: "5h 40m",
      icon: "📊",
      status: "In Progress",
    },
    {
      id: 6,
      title: "Cloud Computing",
      description:
        "Learn the basics of cloud services, deployment and modern infrastructure.",
      category: "Technology",
      progress: 0,
      lessons: 14,
      duration: "4h 50m",
      icon: "☁️",
      status: "Not Started",
    },
  ];

  const filters = ["All", "In Progress", "Started", "Not Started"];

  const filteredCourses = courses.filter((course) => {
    const matchesFilter =
      activeFilter === "All" || course.status === activeFilter;

    const matchesSearch = course.title
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="courses-page">
      {/* HEADER */}

      <div className="courses-header">
        <div>
          <p className="courses-tag">YOUR LEARNING LIBRARY</p>

          <h1>My Courses 📚</h1>

          <p className="courses-subtitle">
            Continue your learning journey and explore new topics.
          </p>
        </div>

        <button className="explore-btn">
          <span>✨</span>
          Explore New Course
        </button>
      </div>

      {/* STATS */}

      <div className="course-stats">
        <div className="course-stat-card">
          <div className="stat-icon purple">📚</div>

          <div>
            <p>Total Courses</p>
            <h2>{courses.length}</h2>
          </div>
        </div>

        <div className="course-stat-card">
          <div className="stat-icon blue">▶</div>

          <div>
            <p>In Progress</p>
            <h2>
              {courses.filter(
                (course) =>
                  course.status === "In Progress"
              ).length}
            </h2>
          </div>
        </div>

        <div className="course-stat-card">
          <div className="stat-icon orange">⏱</div>

          <div>
            <p>Learning Hours</p>
            <h2>12.5h</h2>
          </div>
        </div>

        <div className="course-stat-card">
          <div className="stat-icon green">🏆</div>

          <div>
            <p>Completed</p>
            <h2>0</h2>
          </div>
        </div>
      </div>

      {/* SEARCH */}

      <div className="courses-tools">
        <div className="course-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search your courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="course-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={
                activeFilter === filter
                  ? "filter-active"
                  : ""
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION TITLE */}

      <div className="courses-section-header">
        <div>
          <h2>Your Courses</h2>

          <p>
            {filteredCourses.length} courses available
          </p>
        </div>

        <button className="sort-btn">
          Sort by Recent ↓
        </button>
      </div>

      {/* COURSE GRID */}

      <div className="courses-grid">
        {filteredCourses.map((course) => (
          <div className="course-card" key={course.id}>
            <div className="course-card-top">
              <div className="course-main-icon">
                {course.icon}
              </div>

              <span
                className={`course-status ${course.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {course.status}
              </span>
            </div>

            <p className="course-category">
              {course.category}
            </p>

            <h3>{course.title}</h3>

            <p className="course-description">
              {course.description}
            </p>

            <div className="course-details">
              <span>📖 {course.lessons} Lessons</span>

              <span>⏱ {course.duration}</span>
            </div>

            <div className="course-progress-section">
              <div className="course-progress-title">
                <span>Progress</span>

                <strong>{course.progress}%</strong>
              </div>

              <div className="course-progress-bar">
                <div
                  className="course-progress-fill"
                  style={{
                    width: `${course.progress}%`,
                  }}
                ></div>
              </div>
            </div>

            <button className="course-action-btn">
              {course.progress > 0
                ? "Continue Learning"
                : "Start Course"}

              <span>→</span>
            </button>
          </div>
        ))}
      </div>

      {/* EMPTY RESULT */}

      {filteredCourses.length === 0 && (
        <div className="no-courses">
          <div>🔍</div>

          <h2>No courses found</h2>

          <p>
            Try searching for something different.
          </p>
        </div>
      )}
    </div>
  );
}

export default Courses;