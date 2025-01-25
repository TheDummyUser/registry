package timer

import (
	"database/sql"
	"time"

	"github.com/TheDummyUser/server/models"
	"github.com/gofiber/fiber/v2"
)

func SetUpRoutes(app *fiber.App, db *sql.DB) {
	app.Post("/starttimer", func(c *fiber.Ctx) error {
		c.Set("content-type", "application/json")
		return Timerstart(c, db)
	})
	app.Post("/checktimer", func(c *fiber.Ctx) error {
		c.Set("content-type", "application/json")
		return Checktimer(c, db)
	})
	app.Post("/stoptimer", func(c *fiber.Ctx) error {
		c.Set("content-type", "application/json")
		return StopTimer(c, db)
	})

}

// Timerstart starts the timer for a user
func Timerstart(c *fiber.Ctx, db *sql.DB) error {
	// Parse the request body for the user ID
	var body struct {
		UserID int `json:"user_id"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":  "Invalid request body",
			"status": fiber.StatusBadRequest,
		})
	}

	// Validate user ID
	if body.UserID <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":  "Invalid user ID",
			"status": fiber.StatusBadRequest,
		})
	}

	// Check if there is an active timer for the user
	var existingTimer models.UserTimer
	err := db.QueryRow(`
		SELECT id, user_id, is_running, start_time
		FROM user_timers
		WHERE user_id = ? AND is_running = TRUE
	`, body.UserID).Scan(&existingTimer.ID, &existingTimer.UserID, &existingTimer.IsRunning, &existingTimer.StartTime)

	if err == nil {
		// Timer already running
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error":  "A timer is already running for this user",
			"status": fiber.StatusConflict,
			"details": fiber.Map{
				"start_time": existingTimer.StartTime,
			},
		})
	} else if err != sql.ErrNoRows {
		// Database error
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Database query failed",
			"status": fiber.StatusInternalServerError,
		})
	}

	// Start a new timer
	currentTime := time.Now()
	currentDate := currentTime.Format("2006-01-02")

	_, err = db.Exec(`
		INSERT INTO user_timers (user_id, date, start_time, is_running)
		VALUES (?, ?, ?, ?)
	`, body.UserID, currentDate, currentTime, true)

	if err != nil {
		// Log error and respond
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to start timer",
			"status": fiber.StatusInternalServerError,
		})
	}

	// Success response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Timer started successfully",
		"status":  fiber.StatusOK,
		"details": fiber.Map{
			"start_time": currentTime,
			"date":       currentDate,
		},
	})
}

func Checktimer(c *fiber.Ctx, db *sql.DB) error {
	// Get user ID from the request body
	var body struct {
		UserID int `json:"user_id"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":  "Unable to parse request body",
			"status": fiber.StatusBadRequest,
		})
	}

	// Query the database for an active timer
	var activeTimer models.UserTimer
	err := db.QueryRow(`
		SELECT id, user_id, date, start_time, is_running
		FROM user_timers
		WHERE user_id = ? AND is_running = TRUE
	`, body.UserID).Scan(&activeTimer.ID, &activeTimer.UserID, &activeTimer.Date, &activeTimer.StartTime, &activeTimer.IsRunning)

	if err == sql.ErrNoRows {
		// No active timer found
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No active timer found for this user",
			"status":  fiber.StatusNotFound,
		})
	} else if err != nil {
		// Other database errors
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Database query failed",
			"status": fiber.StatusInternalServerError,
		})
	}

	// Calculate elapsed time since the timer started
	currentTime := time.Now()
	elapsed := currentTime.Sub(activeTimer.StartTime)

	// Format the elapsed time
	hours := int(elapsed.Hours())
	minutes := int(elapsed.Minutes()) % 60
	seconds := int(elapsed.Seconds()) % 60

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message":    "Timer is active",
		"status":     fiber.StatusOK,
		"start_time": activeTimer.StartTime,
		"elapsed": fiber.Map{
			"hours":   hours,
			"minutes": minutes,
			"seconds": seconds,
		},
	})
}

func StopTimer(c *fiber.Ctx, db *sql.DB) error {
	// Get user ID from the request body
	var body struct {
		UserID int `json:"user_id"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":  "Unable to parse request body",
			"status": fiber.StatusBadRequest,
		})
	}

	// Check if there's an active timer
	var activeTimer models.UserTimer
	err := db.QueryRow(`
		SELECT id, user_id, start_time, is_running
		FROM user_timers
		WHERE user_id = ? AND is_running = TRUE
	`, body.UserID).Scan(&activeTimer.ID, &activeTimer.UserID, &activeTimer.StartTime, &activeTimer.IsRunning)

	if err == sql.ErrNoRows {
		// No active timer found
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "No active timer found for this user",
			"status":  fiber.StatusNotFound,
		})
	} else if err != nil {
		// Other database errors
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Database query failed",
			"status": fiber.StatusInternalServerError,
		})
	}

	// Stop the timer
	currentTime := time.Now()
	elapsed := currentTime.Sub(activeTimer.StartTime)

	_, err = db.Exec(`
		UPDATE user_timers
		SET end_time = ?, is_running = FALSE
		WHERE id = ?
	`, currentTime, activeTimer.ID)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Failed to stop the timer",
			"status": fiber.StatusInternalServerError,
		})
	}

	// Format elapsed time
	hours := int(elapsed.Hours())
	minutes := int(elapsed.Minutes()) % 60
	seconds := int(elapsed.Seconds()) % 60

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Timer stopped successfully",
		"status":  fiber.StatusOK,
		"details": fiber.Map{
			"start_time": activeTimer.StartTime,
			"end_time":   currentTime,
			"elapsed": fiber.Map{
				"hours":   hours,
				"minutes": minutes,
				"seconds": seconds,
			},
		},
	})
}
