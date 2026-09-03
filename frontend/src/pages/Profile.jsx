import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "./Profile.css";

function Profile() {
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Currently logged-in user's email
  const userEmail =
    localStorage.getItem("userEmail") || "guest@example.com";

  // Unique localStorage keys
  const profileKey = `profile_${userEmail}`;
  const savedMaterialsKey = `saved_materials_${userEmail}`;

  const defaultUser = {
    name: userEmail.split("@")[0],
    email: userEmail,
    bio: "Passionate learner exploring Artificial Intelligence and technology.",
    university: "Student",
    language: "English",
  };

  const [user, setUser] = useState(defaultUser);

  const [savedMaterials, setSavedMaterials] = useState([]);

  // Load saved profile data
  useEffect(() => {
    const savedProfile = localStorage.getItem(profileKey);

    if (savedProfile) {
      setUser(JSON.parse(savedProfile));
    } else {
      setUser({
        ...defaultUser,
        email: userEmail,
      });
    }

    const savedData = localStorage.getItem(savedMaterialsKey);

    if (savedData) {
      setSavedMaterials(JSON.parse(savedData));
    } else {
      setSavedMaterials([]);
    }
  }, [userEmail]);

  // Save materials automatically
  useEffect(() => {
    localStorage.setItem(
      savedMaterialsKey,
      JSON.stringify(savedMaterials)
    );
  }, [savedMaterials, savedMaterialsKey]);

  // Handle input changes
  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  // Save profile data
  const handleSave = () => {
    const updatedUser = {
      ...user,
      email: userEmail,
    };

    localStorage.setItem(
      profileKey,
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setEditing(false);

    alert("Profile updated successfully! 🎉");
  };

  // Avatar initials
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // Study materials
  const studyMaterials = [
    {
      id: 1,
      type: "video",
      icon: "🎥",
      title: "Environmental Studies Video Lecture",
      description:
        "Learn important Environmental Studies concepts through an AI teacher video.",
      subject: "Environmental Studies",
      videoUrl:
        "https://geo.dailymotion.com/player.html?video=x8jt9si",
      keyPoints: [
        "Understand environmental concepts",
        "Learn important definitions",
        "Revise unit-wise topics",
      ],
    },
    {
      id: 2,
      type: "notes",
      icon: "📄",
      title: "Environmental Studies Notes",
      description:
        "Complete study notes covering important environmental topics and concepts.",
      subject: "Environmental Studies",
      fileUrl: "#",
      keyPoints: [
        "Environment and sustainability",
        "Natural resources",
        "Biodiversity conservation",
        "Environmental management",
      ],
    },
  ];

  // Save / Remove material
  const toggleSaveMaterial = (material) => {
    const alreadySaved = savedMaterials.some(
      (item) => item.id === material.id
    );

    if (alreadySaved) {
      setSavedMaterials(
        savedMaterials.filter(
          (item) => item.id !== material.id
        )
      );
    } else {
      setSavedMaterials([
        ...savedMaterials,
        material,
      ]);
    }
  };

  const isSaved = (id) => {
    return savedMaterials.some(
      (item) => item.id === id
    );
  };

  // Download notes
  const downloadNotes = () => {
    const notesContent = `
ENVIRONMENTAL STUDIES - IMPORTANT NOTES

UNIT 1: OUR ENVIRONMENT

1. Environment
Environment refers to the surroundings in which living organisms live, grow, interact and survive.

2. Components of Environment
Biotic Components:
- Plants
- Animals
- Microorganisms
- Human beings

Abiotic Components:
- Air
- Water
- Soil
- Temperature
- Sunlight

3. Sustainability
Sustainability means meeting present needs without compromising the ability of future generations to meet their needs.

4. Natural Resources
Natural resources include:
- Forest resources
- Water resources
- Mineral resources
- Energy resources

5. Biodiversity
Biodiversity refers to the variety of living organisms present on Earth.

6. Environmental Pollution
Major types:
- Air pollution
- Water pollution
- Soil pollution
- Noise pollution

IMPORTANT REVISION POINTS

- Protect natural resources.
- Reduce environmental pollution.
- Promote sustainable development.
- Conserve biodiversity.
- Use renewable energy.
- Maintain ecological balance.

Generated for AI Teacher Study Material.
    `;

    const blob = new Blob(
      [notesContent],
      { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      "Environmental_Studies_Notes.txt";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Achievements
  const achievements = [
    {
      icon: "🔥",
      title: "7 Day Streak",
      description: "Learning consistently",
    },
    {
      icon: "📚",
      title: "18 Lessons",
      description: "Lessons completed",
    },
    {
      icon: "⏱️",
      title: "12.5 Hours",
      description: "Total learning time",
    },
    {
      icon: "🤖",
      title: "AI Explorer",
      description: "Started AI learning",
    },
  ];

  // Activity
  const activity = [
    {
      title: "Completed Python Basics",
      time: "Today",
      icon: "🐍",
    },
    {
      title: "Started Artificial Intelligence",
      time: "Yesterday",
      icon: "🤖",
    },
    {
      title: "Completed Data Structures Lesson",
      time: "2 days ago",
      icon: "📊",
    },
    {
      title: "Practiced Machine Learning",
      time: "3 days ago",
      icon: "🧠",
    },
  ];

  // Filter materials
  const displayedMaterials = studyMaterials.filter(
    (material) => {
      if (activeTab === "all") return true;
      if (activeTab === "saved") {
        return isSaved(material.id);
      }

      return material.type === activeTab;
    }
  );

  return (
    <div className="profile-page">

      {/* NAVBAR */}
      <Navbar />

      <main className="profile-main">

        {/* HEADER */}
        <div className="profile-header">

          <div>
            <p className="profile-tag">
              PERSONAL PROFILE
            </p>

            <h1>My Profile 👤</h1>

            <p>
              Manage your personal information and track
              your learning achievements.
            </p>
          </div>

          {!editing ? (
            <button
              className="edit-profile-btn"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <button
              className="save-profile-btn"
              onClick={handleSave}
            >
              ✓ Save Changes
            </button>
          )}

        </div>


        {/* PROFILE HERO */}
        <div className="profile-hero">

          <div className="profile-main-info">

            <div className="profile-avatar">
              {getInitials(user.name)}
            </div>

            <div>
              <h2>{user.name}</h2>

              <p>{userEmail}</p>

              <span className="active-status">
                <span></span>
                Active Learner
              </span>
            </div>

          </div>


          <div className="profile-level">

            <div className="level-circle">
              <strong>42%</strong>
              <span>Progress</span>
            </div>

            <div>
              <h3>Level 4 Learner</h3>

              <p>
                Keep learning to reach the next level!
              </p>
            </div>

          </div>

        </div>


        {/* MAIN GRID */}
        <div className="profile-grid">

          {/* PERSONAL INFORMATION */}
          <div className="profile-info-card">

            <div className="section-title">

              <div>
                <p>ACCOUNT INFORMATION</p>
                <h2>Personal Details</h2>
              </div>

              <span>👤</span>

            </div>


            <div className="profile-form">

              <div className="form-group">

                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={user.name}
                  disabled={!editing}
                  onChange={handleChange}
                />

              </div>


              <div className="form-group">

                <label>Email Address</label>

                <input
                  type="email"
                  value={userEmail}
                  disabled
                />

              </div>


              <div className="form-group">

                <label>About You</label>

                <textarea
                  name="bio"
                  value={user.bio}
                  disabled={!editing}
                  onChange={handleChange}
                />

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label>Role</label>

                  <input
                    type="text"
                    name="university"
                    value={user.university}
                    disabled={!editing}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label>Preferred Language</label>

                  <select
                    name="language"
                    value={user.language}
                    disabled={!editing}
                    onChange={handleChange}
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                    <option>Hinglish</option>
                  </select>

                </div>

              </div>

            </div>

          </div>


          {/* LEARNING SUMMARY */}
          <div className="learning-summary-card">

            <p className="summary-tag">
              LEARNING SUMMARY
            </p>

            <h2>Your Journey</h2>


            <div className="summary-item">

              <div className="summary-icon purple">
                📚
              </div>

              <div>
                <strong>6</strong>
                <p>Total Courses</p>
              </div>

            </div>


            <div className="summary-item">

              <div className="summary-icon blue">
                🎯
              </div>

              <div>
                <strong>42%</strong>
                <p>Average Progress</p>
              </div>

            </div>


            <div className="summary-item">

              <div className="summary-icon orange">
                ⏱️
              </div>

              <div>
                <strong>12.5h</strong>
                <p>Learning Time</p>
              </div>

            </div>


            <div className="summary-item">

              <div className="summary-icon green">
                🔥
              </div>

              <div>
                <strong>7 Days</strong>
                <p>Current Streak</p>
              </div>

            </div>

          </div>

        </div>


        {/* ================= STUDY MATERIALS ================= */}

        <div className="study-material-section">

          <div className="study-material-header">

            <div>
              <p className="profile-tag">
                MY STUDY LIBRARY
              </p>

              <h2>
                Study Materials 📚
              </h2>

              <p>
                Access your videos, notes and important
                revision points in one place.
              </p>
            </div>

            <div className="saved-count">
              🔖 {savedMaterials.length} Saved
            </div>

          </div>


          {/* TABS */}

          <div className="material-tabs">

            <button
              className={
                activeTab === "all"
                  ? "material-tab active"
                  : "material-tab"
              }
              onClick={() => setActiveTab("all")}
            >
              📚 All Materials
            </button>

            <button
              className={
                activeTab === "video"
                  ? "material-tab active"
                  : "material-tab"
              }
              onClick={() => setActiveTab("video")}
            >
              🎥 Videos
            </button>

            <button
              className={
                activeTab === "notes"
                  ? "material-tab active"
                  : "material-tab"
              }
              onClick={() => setActiveTab("notes")}
            >
              📄 Notes
            </button>

            <button
              className={
                activeTab === "saved"
                  ? "material-tab active"
                  : "material-tab"
              }
              onClick={() => setActiveTab("saved")}
            >
              🔖 Saved
            </button>

          </div>


          {/* MATERIAL CARDS */}

          <div className="materials-grid">

            {displayedMaterials.length > 0 ? (

              displayedMaterials.map((material) => (

                <div
                  className="study-material-card"
                  key={material.id}
                >

                  <div className="material-card-top">

                    <div className="material-icon">
                      {material.icon}
                    </div>

                    <span className="material-type">
                      {material.type === "video"
                        ? "VIDEO LECTURE"
                        : "STUDY NOTES"}
                    </span>

                  </div>


                  <h3>{material.title}</h3>

                  <p className="material-description">
                    {material.description}
                  </p>


                  {/* VIDEO PLAYER */}

                  {material.type === "video" && (

                    <div className="video-wrapper">

                      <iframe
                        src={material.videoUrl}
                        title={material.title}
                        allowFullScreen
                      />

                    </div>

                  )}


                  {/* KEY POINTS */}

                  <div className="key-points-box">

                    <h4>
                      🧠 Key Points
                    </h4>

                    <ul>

                      {material.keyPoints.map(
                        (point, index) => (

                          <li key={index}>
                            {point}
                          </li>

                        )
                      )}

                    </ul>

                  </div>


                  {/* ACTION BUTTONS */}

                  <div className="material-actions">

                    {material.type === "notes" && (

                      <button
                        className="download-material-btn"
                        onClick={downloadNotes}
                      >
                        ⬇ Download Notes
                      </button>

                    )}

                    <button
                      className={
                        isSaved(material.id)
                          ? "save-material-btn saved"
                          : "save-material-btn"
                      }
                      onClick={() =>
                        toggleSaveMaterial(material)
                      }
                    >
                      {isSaved(material.id)
                        ? "✓ Saved"
                        : "🔖 Save"}
                    </button>

                  </div>

                </div>

              ))

            ) : (

              <div className="empty-material">

                <div>📭</div>

                <h3>
                  No Materials Found
                </h3>

                <p>
                  Your saved study materials will
                  appear here.
                </p>

              </div>

            )}

          </div>

        </div>


        {/* ACHIEVEMENTS */}

        <div className="profile-section-heading">

          <div>

            <p className="profile-tag">
              ACHIEVEMENTS
            </p>

            <h2>
              Your Learning Badges 🏆
            </h2>

          </div>

        </div>


        <div className="profile-achievements">

          {achievements.map(
            (achievement, index) => (

              <div
                className="profile-achievement-card"
                key={index}
              >

                <div className="badge-icon">
                  {achievement.icon}
                </div>

                <h3>
                  {achievement.title}
                </h3>

                <p>
                  {achievement.description}
                </p>

              </div>

            )
          )}

        </div>


        {/* RECENT ACTIVITY */}

        <div className="profile-section-heading">

          <div>

            <p className="profile-tag">
              RECENT ACTIVITY
            </p>

            <h2>
              Learning Timeline
            </h2>

          </div>

        </div>


        <div className="activity-card">

          {activity.map((item, index) => (

            <div
              className="activity-item"
              key={index}
            >

              <div className="activity-icon">
                {item.icon}
              </div>


              <div className="activity-content">

                <h3>
                  {item.title}
                </h3>

                <p>
                  {item.time}
                </p>

              </div>


              <div className="activity-dot"></div>

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}

export default Profile;