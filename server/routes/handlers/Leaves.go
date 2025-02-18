package handlers

import (
	"github.com/TheDummyUser/registry/model"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
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

	err := db.Where("user_id = ?", inputs.UserID).Find(&leaves).Error
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "No leaves found"})
	}

	return c.JSON(fiber.Map{
		"message": "Leaves fetched successfully",
		"details": leaves,
	})
}
