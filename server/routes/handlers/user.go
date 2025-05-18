package handlers

import (
	"time"

	"github.com/TheDummyUser/registry/model"
	"github.com/TheDummyUser/registry/utils"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func GetUsers(c *fiber.Ctx, db *gorm.DB) error {
	var users []model.User
	result := db.Find(&users)

	if result.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Database error"})
	}

	return c.JSON(users)
}

func Signup(c *fiber.Ctx, db *gorm.DB) error {
	var input model.SignupRequest

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}
	var existingUser model.User

	if err := db.Where("email = ? OR username = ?", input.Email, input.Username).First(&existingUser).Error; err == nil {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Email or username already exists",
		})
	}
	hashPassword, err := utils.HashPassword(input.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	parsedDOB, err := time.Parse("2006-01-02", input.DOB)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid date format. Use YYYY-MM-DD."})
	}

	user := model.User{
		Username: input.Username,
		Email:    input.Email,
		DOB:      parsedDOB,
		Password: hashPassword,
	}

	if err := db.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "user created sucesssfully", "details": fiber.Map{
		"id":         user.ID,
		"username":   user.Username,
		"email":      user.Email,
		"dob":        user.DOB,
		"created_at": user.CreatedAt,
		"updated_at": user.UpdatedAt,
		"is_admin":   user.IsAdmin,
	}})
}

func Login(c *fiber.Ctx, db *gorm.DB) error {
	var input model.LoginRequest

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	var user model.User

	// Check if user exists
	if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	// Check password
	if !utils.ComparePassword(user.Password, input.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "Invalid email or password",
		})
	}

	// Generate access and refresh tokens
	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, user.Username)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate tokens",
		})
	}

	// Success response
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "User login successfully",
		"details": fiber.Map{
			"id":         user.ID,
			"username":   user.Username,
			"email":      user.Email,
			"dob":        user.DOB,
			"created_at": user.CreatedAt,
			"updated_at": user.UpdatedAt,
			"is_admin":   user.IsAdmin,
			"tokens": fiber.Map{
				"access_token":  accessToken.Token,
				"refresh_token": refreshToken.Token,
			},
		},
	})
}

func GetUserDetails(c *fiber.Ctx, db *gorm.DB) error {
	userID, err := utils.GetUserIDFromToken(c)

	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err, "status_code": fiber.StatusUnauthorized})
	}

	var user model.User
	if err := db.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	return c.JSON(fiber.Map{
		"id":           user.ID,
		"username":     user.Username,
		"email":        user.Email,
		"dob":          user.DOB,
		"created_at":   user.CreatedAt,
		"updated_at":   user.UpdatedAt,
		"is_admin":     user.IsAdmin,
		"total_leaves": user.TotalLeaves,
		"used_leaves":  user.LeavesUsed,
	})
}

func RefreshToken(c *fiber.Ctx, db *gorm.DB) error {
	type RefreshRequest struct {
		RefreshToken string `json:"refresh_token"`
	}

	var req RefreshRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	claims, err := utils.ValidateToken(req.RefreshToken, utils.RefreshToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or expired refresh token"})
	}

	userID := uint(claims["user_id"].(float64))
	username := claims["username"].(string)

	accessDetails, _, err := utils.GenerateTokens(userID, username)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate tokens"})
	}

	return c.JSON(fiber.Map{
		"access_token": accessDetails.Token,
		"expires_at":   accessDetails.ExpiresAt,
	})
}
