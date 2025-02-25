package utils

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// GetUserIDFromToken extracts the user ID from the JWT token
func GetUserIDFromToken(c *fiber.Ctx) (uint, error) {
	user := c.Locals("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)

	// Convert the user_id from float64 to uint
	userID := uint(claims["user_id"].(float64))
	return userID, nil
}
