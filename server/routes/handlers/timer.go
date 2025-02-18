package handlers

import (
	"fmt"
	"time"

	"github.com/TheDummyUser/registry/model"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func CheckTimer(c *fiber.Ctx, db *gorm.DB) error {
	type Tim struct {
		UserID uint `json:"user_id"`
	}

	var inputs Tim
	if err := c.BodyParser(&inputs); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	if inputs.UserID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
	}

	var timer model.Timer
	err := db.Where("user_id = ? AND end_time IS NULL", inputs.UserID).Order("start_time DESC").First(&timer).Error
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No active timer found"})
	}

	duration := time.Since(timer.StartTime)
	hours := int(duration.Hours())
	minutes := int(duration.Minutes()) % 60
	seconds := int(duration.Seconds()) % 60
	timeFormatted := fmt.Sprintf("%02d:%02d:%02d", hours, minutes, seconds)

	return c.JSON(fiber.Map{
		"message": "Timer started successfully",
		"details": fiber.Map{
			"hours":         timeFormatted,
			"timer_started": timer.StartTime.Format(time.RFC3339),
			"timer_stopped": nil,
		},
	})
}

func StartTimer(c *fiber.Ctx, db *gorm.DB) error {
	type Tim struct {
		UserID uint `json:"user_id"`
	}

	var inputs Tim
	if err := c.BodyParser(&inputs); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	if inputs.UserID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
	}

	// Check if an active timer already exists
	var existingTimer model.Timer
	if err := db.Where("user_id = ? AND end_time IS NULL", inputs.UserID).First(&existingTimer).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "An active timer already exists"})
	}

	// Create a new timer
	newTimer := model.Timer{
		UserID:    inputs.UserID,
		StartTime: time.Now(),
	}
	if err := db.Create(&newTimer).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to start timer"})
	}

	duration := time.Since(newTimer.StartTime)
	hours := int(duration.Hours())
	minutes := int(duration.Minutes()) % 60
	seconds := int(duration.Seconds()) % 60
	timeFormatted := fmt.Sprintf("%02d:%02d:%02d", hours, minutes, seconds)

	return c.JSON(fiber.Map{
		"message": "Timer started successfully",
		"details": fiber.Map{
			"hours":         timeFormatted,
			"timer_started": newTimer.StartTime.Format(time.RFC3339),
			"timer_stopped": nil,
		},
	})
}

func EndTimer(c *fiber.Ctx, db *gorm.DB) error {
	type Tim struct {
		UserID uint `json:"user_id"`
	}

	var inputs Tim
	if err := c.BodyParser(&inputs); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	if inputs.UserID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
	}

	// Find the active timer
	var timer model.Timer
	err := db.Where("user_id = ? AND end_time IS NULL", inputs.UserID).Order("start_time DESC").First(&timer).Error
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No active timer found"})
	}

	// Update the timer with the stop time
	timer.EndTime = time.Now()
	if err := db.Save(&timer).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to stop timer"})
	}

	duration := time.Since(timer.StartTime)
	hours := int(duration.Hours())
	minutes := int(duration.Minutes()) % 60
	seconds := int(duration.Seconds()) % 60
	timeFormatted := fmt.Sprintf("%02d:%02d:%02d", hours, minutes, seconds)

	return c.JSON(fiber.Map{
		"message": "Timer stopped successfully",
		"details": fiber.Map{
			"hours":         timeFormatted,
			"timer_started": timer.StartTime.Format(time.RFC3339),
			"timer_stopped": timer.EndTime.Format(time.RFC3339),
		},
	})
}
