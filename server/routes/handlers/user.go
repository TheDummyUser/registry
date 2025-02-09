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
	}})
}

func Login(c *fiber.Ctx, db *gorm.DB) error {
	var input model.LoginRequest

	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input"})
	}

	var user model.User

	if err := db.Where("email = ?", input.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "invalid email or password",
		})
	}

	if !utils.ComparePassword(user.Password, input.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "invalid username or password",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "user login sucesssfully", "details": fiber.Map{
		"id":         user.ID,
		"username":   user.Username,
		"email":      user.Email,
		"dob":        user.DOB,
		"created_at": user.CreatedAt,
		"updated_at": user.UpdatedAt,
	}})
}
