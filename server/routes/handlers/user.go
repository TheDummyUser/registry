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
	var input model.AdminCreateUserRequest

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
		Password: hashPassword,
		DOB:      parsedDOB,
		Role:     input.Role,
		TeamID:   input.TeamID,
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
		"role":       user.Role,
		"team_id":    user.TeamID,
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
	var teamID uint
	if user.TeamID != nil {
		teamID = *user.TeamID
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.ID, user.Username, user.Role, teamID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to generate tokens",
		})
	}

	// Hash the refresh token before storage
	hashedRefreshToken := utils.HashToken(refreshToken.Token)

	// Create refresh token record
	newRefreshToken := model.RefreshToken{
		TokenHash: hashedRefreshToken,
		UserID:    user.ID,
		ExpiresAt: refreshToken.ExpiresAt,
	}

	if err := db.Create(&newRefreshToken).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to store refresh token",
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
			"role":       user.Role,
			"team_id":    teamID,
			"tokens": fiber.Map{
				"access_token":  accessToken.Token,
				"refresh_token": newRefreshToken.TokenHash,
			},
		},
	})
}

func Logout(c *fiber.Ctx, db *gorm.DB) error {
	type LogoutRequest struct {
		RefreshTokenHash string `json:"refresh_token"`
	}

	var req LogoutRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Try to find the token in DB
	var token model.RefreshToken
	if err := db.Where("token_hash = ?", req.RefreshTokenHash).First(&token).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Refresh token not found"})
	}

	// Mark token as revoked
	token.Revoked = true
	if err := db.Save(&token).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to revoke token"})
	}

	return c.JSON(fiber.Map{"message": "Logout successful"})
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
		"role":         user.Role,
		"team_id":      user.TeamID,
		"total_leaves": user.TotalLeaves,
		"used_leaves":  user.LeavesUsed,
	})
}

func RefreshToken(c *fiber.Ctx, db *gorm.DB) error {
	type RefreshRequest struct {
		RefreshToken string `json:"refresh_token"` // This is the hashed token sent by client
	}

	var req RefreshRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	// Find token by hash
	var token model.RefreshToken
	if err := db.Where("token_hash = ? AND revoked = false", req.RefreshToken).First(&token).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid or revoked refresh token"})
	}

	// Fetch user for token regeneration
	var user model.User
	if err := db.First(&user, token.UserID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	// Generate new access and refresh tokens
	var teamID uint
	if user.TeamID != nil {
		teamID = *user.TeamID
	}
	newAccessToken, newRefreshToken, err := utils.GenerateTokens(user.ID, user.Username, user.Role, teamID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate tokens"})
	}

	// Hash new refresh token
	newHashedRefreshToken := utils.HashToken(newRefreshToken.Token)

	// Update existing refresh token record with new hash and expiry
	token.TokenHash = newHashedRefreshToken
	token.ExpiresAt = newRefreshToken.ExpiresAt
	token.UpdatedAt = time.Now()

	if err := db.Save(&token).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update refresh token"})
	}

	return c.JSON(fiber.Map{
		"access_token":  newAccessToken.Token,
		"refresh_token": newHashedRefreshToken,
		"expires_at":    newAccessToken.ExpiresAt,
	})
}
