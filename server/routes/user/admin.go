package user

import (
	"database/sql"

	"github.com/TheDummyUser/server/models"
	"github.com/TheDummyUser/server/services"
	"github.com/gofiber/fiber/v2"
)

func PromoteToAdmin(c *fiber.Ctx, db *sql.DB) error {
	// Structure to hold the promotion request
	type PromoteRequest struct {
		AdminUsername  string `json:"admin_username"`  // Username of the admin performing the action
		AdminPassword  string `json:"admin_password"`  // Password of the admin
		TargetUsername string `json:"target_username"` // Username of the user to promote
	}

	var req PromoteRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request format",
		})
	}

	// 1. First verify the admin's credentials and admin status
	var adminUser models.Existinguser
	err := db.QueryRow(
		"SELECT id, password, is_admin FROM users WHERE username = ?",
		req.AdminUsername,
	).Scan(&adminUser.ID, &adminUser.Password, &adminUser.IsAdmin)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error": "Admin user not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	// Verify admin status
	if !adminUser.IsAdmin {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "Only admin users can promote others",
		})
	}

	// Verify admin password
	if err := services.ComparePassword(adminUser.Password, req.AdminPassword); err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid admin credentials",
		})
	}

	// 2. Find and verify the target user exists
	var targetUser models.Existinguser
	err = db.QueryRow(
		"SELECT id, is_admin FROM users WHERE username = ?",
		req.TargetUsername,
	).Scan(&targetUser.ID, &targetUser.IsAdmin)

	if err != nil {
		if err == sql.ErrNoRows {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Target user not found",
			})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal server error",
		})
	}

	// Check if user is already an admin
	if targetUser.IsAdmin {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User is already an admin",
		})
	}

	// 3. Promote the target user
	_, err = db.Exec(
		"UPDATE users SET is_admin = TRUE WHERE id = ?",
		targetUser.ID,
	)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to promote user to admin",
		})
	}

	return c.JSON(fiber.Map{
		"message": "User promoted to admin successfully",
	})
}
