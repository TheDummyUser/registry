package handlers

import (
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
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "user id is not valid, enter the user id",
		})
	}

	today := time.Now().Format("2006-01-02")

	var count int64

	err := db.Model(&model.Timer{}).Where("user_id = ? AND DATE(start_time) = ? AND end_time IS NULL", inputs.UserID, today).Count(&count).Error

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Database error"})
	}

	// Return JSON response
	return c.JSON(fiber.Map{"active_timer": count > 0})

}
