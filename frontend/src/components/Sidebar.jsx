import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: "⌂" },
    { name: "My Learning", path: "/learning", icon: "◉" },
    { name: "Courses", path: "/courses", icon: "▣" },
    { name: "AI Teacher", path: "/ai-teacher", icon: "✦" },
    { name: "Progress", path: "/progress", icon: "↗" },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">AI</div>

        <div>
          <h2>AI Teacher</h2>
          <span>SMART LEARNING</span>
        </div>
      </div>

      {/* Menu */}
      <div className="sidebar-menu">
        <p className="menu-title">MAIN MENU</p>

        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "sidebar-link active"
                : "sidebar-link"
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom AI Card */}
      <div className="sidebar-bottom">
        <div className="mini-ai-icon">🤖</div>

        <h3>Need help?</h3>

        <p>Ask your AI Teacher anything.</p>

        <button onClick={() => navigate("/ai-teacher")}>
          Ask AI →
        </button>
      </div>

      {/* Profile */}
      <div className="sidebar-profile">
        <div className="profile-avatar">S</div>

        <div className="profile-info">
          <strong>Student</strong>
          <span>AI Learner</span>
        </div>

        <button
          className="logout-btn"
          title="Go to Home"
          onClick={() => navigate("/")}
        >
          ↩
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;