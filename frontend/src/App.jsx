import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Study from "./pages/Study";
import Learning from "./pages/Learning";
import MyLearning from "./pages/MyLearning";
import Courses from "./pages/Courses";
import AIChat from "./pages/AIChat";
import Progress from "./pages/Progress";
import Exams from "./pages/Exams";
import Profile from "./pages/Profile";
import ExamQuiz from "./pages/ExamQuiz";

function App() {
  return (
    <Routes>

      {/* HOME */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      {/* STUDY MATERIAL */}
      <Route
        path="/study"
        element={<Study />}
      />

      {/* MY LEARNING */}
      <Route
        path="/my-learning"
        element={<MyLearning />}
      />

      {/* LEARNING */}
      <Route
        path="/learning"
        element={<Learning />}
      />

      {/* COURSES */}
      <Route
        path="/courses"
        element={<Courses />}
      />

      {/* AI TEACHER */}
      <Route
        path="/ai-teacher"
        element={<AIChat />}
      />

      {/* PROGRESS */}
      <Route
        path="/progress"
        element={<Progress />}
      />

      {/* EXAMS */}
      <Route
        path="/exams"
        element={<Exams />}
      />

      {/* EXAM QUIZ */}
      <Route
        path="/exam-quiz"
        element={<ExamQuiz />}
      />

      {/* PROFILE */}
      <Route
        path="/profile"
        element={<Profile />}
      />

      {/* UNKNOWN ROUTE */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App; 