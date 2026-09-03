// ================= USER DATA MANAGEMENT =================

// Get current logged-in user's email
export const getCurrentUserEmail = () => {
  return localStorage.getItem("userEmail");
};


// Create unique key for each user's data
export const getUserDataKey = (email) => {
  return `aiTeacherData_${email}`;
};


// Default data for every NEW user
export const getDefaultUserData = (email) => {
  return {
    email: email,

    profile: {
      name: email ? email.split("@")[0] : "New User",
      email: email,
      bio: "Welcome to AI Teacher!",
      university: "Student",
      language: "English",
    },

    learning: {
      totalCourses: 0,
      completedLessons: 0,
      totalLessons: 0,
      learningTime: 0,
      streak: 0,

      courses: [],
    },

    exams: {
      attempted: 0,
      results: [],
      averageScore: 0,
    },

    achievements: [],
  };
};


// Get complete data of current user
export const getUserData = () => {
  const email = getCurrentUserEmail();

  if (!email) {
    return null;
  }

  const key = getUserDataKey(email);

  const savedData = localStorage.getItem(key);

  // If user already has data
  if (savedData) {
    return JSON.parse(savedData);
  }

  // Create NEW data for new user
  const newUserData = getDefaultUserData(email);

  localStorage.setItem(
    key,
    JSON.stringify(newUserData)
  );

  return newUserData;
};


// Save complete user data
export const saveUserData = (data) => {
  const email = getCurrentUserEmail();

  if (!email) {
    return;
  }

  const key = getUserDataKey(email);

  localStorage.setItem(
    key,
    JSON.stringify(data)
  );
};


// Update only specific user data
export const updateUserData = (section, newData) => {
  const userData = getUserData();

  if (!userData) {
    return;
  }

  userData[section] = {
    ...userData[section],
    ...newData,
  };

  saveUserData(userData);

  return userData;
};


// Reset current user's data
export const resetUserData = () => {
  const email = getCurrentUserEmail();

  if (!email) {
    return;
  }

  const key = getUserDataKey(email);

  localStorage.removeItem(key);
};