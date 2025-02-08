package handlers

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetUsers(c *fiber.Ctx, db *gorm.DB) error {
	type User struct {
		ID    uint   `json:"id"`
		Name  string `json:"name"`
		Email string `json:"email"`
	}

	var users []User

	result := db.Find(&users)

	if result.Error != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(users)
}
