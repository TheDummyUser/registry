package handlers

import (
	"time"

	"github.com/TheDummyUser/registry/model"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func UserLeaveList(c *fiber.Ctx, db *gorm.DB) error {
	var leaves []model.Leave

	if err := db.Find(&leaves).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	if len(leaves) == 0 {
		return c.JSON(fiber.Map{
			"message": "No leaves found",
			"details": []model.Leave{},
		})
	}

	return c.JSON(fiber.Map{
		"message": "Leaves fetched successfully",
		"details": leaves,
	})
}

func ApplyLeave(c *fiber.Ctx, db *gorm.DB) error {
	// Create a struct that matches the JSON structure but uses strings for dates
	type LeaveRequest struct {
		UserID    uint   `json:"user_id"`
		StartDate string `json:"start_date"`
		EndDate   string `json:"end_date"`
		Reason    string `json:"reason"`
	}

	var request LeaveRequest
	if err := c.BodyParser(&request); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "Invalid input format",
			"details": err.Error(),
		})
	}

	if request.UserID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
	}

	if request.Reason == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Reason is required"})
	}

	// Parse the date strings
	startDate, err := time.Parse("2006-01-02", request.StartDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "Invalid start date format. Use YYYY-MM-DD.",
			"details": err.Error(),
		})
	}

	endDate, err := time.Parse("2006-01-02", request.EndDate)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "Invalid end date format. Use YYYY-MM-DD.",
			"details": err.Error(),
		})
	}

	// Calculate the number of leave days
	days := endDate.Sub(startDate).Hours()/24 + 1
	if days <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "End date must be after or equal to start date"})
	}

	var user model.User
	if err := db.First(&user, request.UserID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	if user.RemainingLeaves < uint(days) {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Not enough remaining leaves",
			"details": fiber.Map{
				"days_requested":   days,
				"remaining_leaves": user.RemainingLeaves,
			},
		})
	}

	// Update user leave counts
	user.LeavesUsed += uint(days)
	user.RemainingLeaves -= uint(days)

	if err := db.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user leave counts"})
	}

	leave := model.Leave{
		UserID:    request.UserID,
		StartDate: startDate,
		EndDate:   endDate,
		Reason:    request.Reason,
	}

	if err := db.Create(&leave).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Leave could not be applied"})
	}

	return c.JSON(fiber.Map{
		"message": "Leave applied successfully",
		"details": fiber.Map{
			"leave_id":         leave.ID,
			"days_requested":   days,
			"leaves_used":      user.LeavesUsed,
			"remaining_leaves": user.RemainingLeaves,
		},
	})
}
