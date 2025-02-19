package handlers

import (
	"github.com/TheDummyUser/registry/model"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"time"
)

func UserLeaveList(c *fiber.Ctx, db *gorm.DB) error {
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

	var leaves []model.Leave

	if err := db.Where("user_id = ?", inputs.UserID).Find(&leaves).Error; err != nil {
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
	type Tim struct {
		UserID    uint      `json:"user_id"`
		StartDate time.Time `json:"start_date"`
		EndDate   time.Time `json:"end_date"`
		Reason    string    `json:"reason"`
	}

	var inputs Tim
	if err := c.BodyParser(&inputs); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	if inputs.UserID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID is required"})
	}

	if inputs.Reason == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Reason is required"})
	}

	leave := model.Leave{
		UserID:    inputs.UserID,
		StartDate: inputs.StartDate,
		EndDate:   inputs.EndDate,
		Reason:    inputs.Reason,
	}

	if err := db.Create(&leave).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Leave could not be applied"})
	}

	return c.JSON(fiber.Map{
		"message": "Leave applied successfully",
		"details": &leave,
	})
}
