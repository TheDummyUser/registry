// export const base_url = '10.0.2.1:8080/api'; // replace with actual domain or IP
export const base_url = "http://127.0.0.1:8080/api";

export const api_urls = {
  // Public
  login: "login",
  signup: "signup",
  refresh: "refresh",
  logout: "logout",

  // user
  getUserDetails: "userdetails",

  // Timer
  checkTimer: "checktimer",
  startTimer: "starttimer",
  stopTimer: "stoptimer",

  // Leave
  applyLeave: "applyleaves",

  // Admin
  getUsers: "users",
  getAllLeaves: "allleaves",
  acceptLeaves: "accept_leaves",
};
