package middleware

import (
	"github.com/TheDummyUser/registry/config"
	"github.com/TheDummyUser/registry/model"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"

	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
)

func Protected() fiber.Handler {
	return jwtware.New(jwtware.Config{
		SigningKey:   jwtware.SigningKey{Key: []byte(config.Coonfig("TOKEN"))},
		ErrorHandler: jwtError,
	})
}

func jwtError(c *fiber.Ctx, err error) error {
	if err.Error() == "Missing or malformed JWT" {
		return c.Status(fiber.StatusBadRequest).
			JSON(fiber.Map{"status": "error", "message": "Missing or malformed JWT", "data": nil})
	}
	return c.Status(fiber.StatusUnauthorized).
		JSON(fiber.Map{"status": "error", "message": "Invalid or expired JWT", "data": nil})
}

func AdminOnly(db *gorm.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		user := c.Locals("user").(*jwt.Token)
		claims := user.Claims.(jwt.MapClaims)

		// Get user ID from claims
		userID := uint(claims["user_id"].(float64))

		// Find user in database
		var dbUser model.User
		if err := db.First(&dbUser, userID).Error; err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"status":  "error",
				"message": "User not found",
				"data":    nil,
			})
		}

		// Check if user is admin
		if !dbUser.IsAdmin {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"status":  "error",
				"message": "Admin access required",
				"data":    nil,
			})
		}

		return c.Next()
	}
}
