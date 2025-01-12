package models

import "time"

type User struct {
	ID       int       `json:"id"`                              // Maps to id in users table
	Time     time.Time `json:"time"`                            // Maps to time in users table
	Username string    `json:"username" validate:"required"`    // Maps to username in users table
	Email    string    `json:"email" validate:"required,email"` // Maps to email in users table
	Password string    `json:"password" validate:"required"`    // Maps to password in users table
	IsAdmin  bool      `json:"is_admin"`                        // Maps to is_admin in users table
}

type Admin struct {
	AdminID  int    `json:"admin_id"`
	Username string `json:"username" validate:"required"`
}

type UserTimer struct {
	ID        int       `json:"id"`                          // Maps to id in user_timers table
	UserID    string    `json:"user_id" validate:"required"` // Maps to user_id in user_timers table
	StartTime time.Time `json:"start_time"`                  // Maps to start_time in user_timers table
	IsRunning bool      `json:"is_running"`                  // Maps to is_running in user_timers table
}

type Existinguser struct {
	ID       int
	Time     time.Time
	Username string
	Email    string
	Password string
	IsAdmin  bool
}
