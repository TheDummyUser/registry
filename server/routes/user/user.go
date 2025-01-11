package user

import (
	"database/sql"
	"log"

	"github.com/TheDummyUser/server/models"
	"github.com/TheDummyUser/server/services"
	"github.com/gofiber/fiber/v2"
)

func SetUpRoutes(app *fiber.App, db *sql.DB) {
	app.Post("/register", func(c *fiber.Ctx) error {
		return SignUp(c, db)
	})
	app.Post("/login", func(c *fiber.Ctx) error {
		return Login(c, db)
	})
}

func SignUp(c *fiber.Ctx, db *sql.DB) error {

	var user models.User

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":  "Invalid request format",
			"status": fiber.StatusBadRequest,
		})
	}
	var existingUser models.Existinguser
	err := db.QueryRow("SELECT username FROM users WHERE username = ?", user.Username).Scan(&existingUser.Username)
	if err != nil {
		if err != sql.ErrNoRows {
			log.Printf("Database error checking username: %v", err)
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error":  "Internal server error",
				"status": fiber.StatusInternalServerError,
			})
		}

	} else {
		// Username was found
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error":  "Username already exists",
			"status": fiber.StatusConflict,
		})
	}

	hashPassword, err := services.HashPassword(user.Password)
	if err != nil {
		log.Printf("Error in password hashing: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Internal server error",
			"status": fiber.StatusInternalServerError,
		})
	}

	_, err = db.Exec("INSERT INTO users (email, username, password) VALUES (?, ?, ?)", user.Email, user.Username, hashPassword)
	if err != nil {
		log.Printf("Error inserting user: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Internal server error",
			"status": fiber.StatusInternalServerError,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User created successfully",
		"status":  fiber.StatusCreated,
	})
}

func Login(c *fiber.Ctx, db *sql.DB) error {
	var user models.User

	// Parse request body
	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":  "Invalid request format",
			"status": fiber.StatusBadRequest,
		})
	}

	// Query database for username and password
	var existingUser models.Existinguser
	err := db.QueryRow("SELECT username, password FROM users WHERE username = ?", user.Username).
		Scan(&existingUser.Username, &existingUser.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			// Username not found
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"error":  "Invalid username or password",
				"status": fiber.StatusUnauthorized,
			})
		}
		log.Printf("Database error checking username: %v", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error":  "Internal server error",
			"status": fiber.StatusInternalServerError,
		})
	}

	// Compare passwords
	err = services.ComparePassword(existingUser.Password, user.Password)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error":  "Invalid username or password",
			"status": fiber.StatusUnauthorized,
		})
	}

	// Return success
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "Login successful",
		"status":  fiber.StatusOK,
	})
}
